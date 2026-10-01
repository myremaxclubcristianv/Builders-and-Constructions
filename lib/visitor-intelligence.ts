/**
 * Core Visitor Intelligence Server Engine
 * CONSTRUCTIONS by AiXLuxury
 *
 * Coordinates event enrichment, session state tracking, database persistence,
 * intelligent noise throttling, and Telegram operational notification dispatch.
 */

import crypto from "crypto";
import { getServiceClient } from "./supabase";
import { sendTelegramNotification } from "./telegram";
import {
  classifyPageType,
  extractLocationFromHeaders,
  parseAcquisitionSource,
  parseUserAgent,
  ParsedLocation,
  ParsedSource,
  ParsedUserAgent
} from "./visitor-parser";
import {
  formatEntityViewMessage,
  formatHighValueActivityMessage,
  formatNewVisitorMessage,
  formatReturningVisitorMessage,
  formatSessionSummaryMessage,
  formatSiteSearchMessage,
  VisitorEventData
} from "./telegram-visitor-formatter";

export interface IncomingVisitorEvent {
  sessionId: string;
  visitorId: string;
  isReturning?: boolean;
  sessionNumber?: number;
  eventType:
    | "NEW_VISITOR"
    | "RETURNING_VISITOR"
    | "PAGE_VIEW"
    | "ENTITY_VIEW"
    | "SEARCH"
    | "INTERACTION"
    | "HIGH_VALUE"
    | "SESSION_SUMMARY";
  path: string;
  pageTitle?: string;
  pageType?: string;
  entityType?: "COMPANY" | "PROJECT" | "CITY" | "SIGNAL" | string;
  entityName?: string;
  entitySlug?: string;
  entityMetadata?: Record<string, unknown>;
  searchQuery?: string;
  searchResultsCount?: number;
  searchSelectedResult?: string;
  actionName?: string;
  actionDetails?: string;
  leadData?: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    message?: string;
    requestType?: string;
  };
  navigationPath?: string[];
  entitiesViewed?: string[];
  searchesPerformed?: string[];
  actionsPerformed?: string[];
  pagesCount?: number;
  durationSeconds?: number;
  timeSpentSeconds?: number;
  scrollDepthPercent?: number;
  referrer?: string;
  searchParams?: Record<string, string>;
  viewport?: string;
  screen?: string;
  language?: string;
  timezone?: string;
  occurredAt?: string;
}

// In-memory session alert state to prevent duplicate notifications
interface SessionNotificationCache {
  notifiedLanding?: boolean;
  notifiedEntities: Set<string>;
  notifiedSearches: Set<string>;
  notifiedHighValue: Set<string>;
  summarySent?: boolean;
  lastEventTime: number;
}

const sessionCache = new Map<string, SessionNotificationCache>();

// Cleanup stale session cache every 15 minutes
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  const maxAge = 2 * 60 * 60 * 1000; // 2 hours
  for (const [sid, state] of sessionCache.entries()) {
    if (now - state.lastEventTime > maxAge) {
      sessionCache.delete(sid);
    }
  }
}, 15 * 60 * 1000);
if (typeof cleanupTimer.unref === 'function') cleanupTimer.unref();

function getSessionState(sessionId: string): SessionNotificationCache {
  let state = sessionCache.get(sessionId);
  if (!state) {
    state = {
      notifiedEntities: new Set<string>(),
      notifiedSearches: new Set<string>(),
      notifiedHighValue: new Set<string>(),
      lastEventTime: Date.now()
    };
    sessionCache.set(sessionId, state);
  }
  state.lastEventTime = Date.now();
  return state;
}

function hashIp(ip: string): string {
  if (!ip) return "anonymous";
  const salt = process.env.TELEMETRY_SALT || "constructions-aixluxury-privacy";
  return crypto.createHash("sha256").update(ip + salt).digest("hex").substring(0, 16);
}

/**
 * Main entry point for processing and recording visitor events.
 */
export async function processVisitorIntelligenceEvent(
  rawEvent: IncomingVisitorEvent,
  headers: Headers | Record<string, string | string[] | undefined>,
  clientIp: string
): Promise<{ success: boolean; telegramSent: boolean; error?: string }> {
  try {
    const rawUa = typeof (headers as Headers).get === "function"
      ? (headers as Headers).get("user-agent")
      : (headers as Record<string, string | string[] | undefined>)["user-agent"];
    const uaString = typeof rawUa === "string" ? rawUa : Array.isArray(rawUa) ? rawUa[0] : "";

    const userAgent: ParsedUserAgent = parseUserAgent(uaString);
    const source: ParsedSource = parseAcquisitionSource(rawEvent.referrer, rawEvent.searchParams);
    const location: ParsedLocation = extractLocationFromHeaders(headers);

    // Fallback timezone from client if header unavailable
    if (!location.timezone && rawEvent.timezone) {
      location.timezone = rawEvent.timezone;
    }

    const pageType = rawEvent.pageType || classifyPageType(rawEvent.path);
    const ipHash = hashIp(clientIp);
    const sessionState = getSessionState(rawEvent.sessionId);

    const eventData: VisitorEventData = {
      sessionId: rawEvent.sessionId,
      visitorId: rawEvent.visitorId,
      isReturning: rawEvent.isReturning,
      sessionNumber: rawEvent.sessionNumber,
      occurredAt: rawEvent.occurredAt || new Date().toISOString(),
      timezone: location.timezone || rawEvent.timezone || "Europe/Bucharest",
      path: rawEvent.path,
      pageTitle: rawEvent.pageTitle,
      pageType,
      entityType: rawEvent.entityType,
      entityName: rawEvent.entityName,
      entitySlug: rawEvent.entitySlug,
      entityMetadata: rawEvent.entityMetadata,
      searchQuery: rawEvent.searchQuery,
      searchResultsCount: rawEvent.searchResultsCount,
      searchSelectedResult: rawEvent.searchSelectedResult,
      actionName: rawEvent.actionName,
      actionDetails: rawEvent.actionDetails,
      leadData: rawEvent.leadData,
      navigationPath: rawEvent.navigationPath,
      entitiesViewed: rawEvent.entitiesViewed,
      searchesPerformed: rawEvent.searchesPerformed,
      actionsPerformed: rawEvent.actionsPerformed,
      pagesCount: rawEvent.pagesCount,
      durationSeconds: rawEvent.durationSeconds,
      timeSpentSeconds: rawEvent.timeSpentSeconds,
      viewport: rawEvent.viewport,
      language: rawEvent.language,
      userAgent,
      source,
      location
    };

    // 1. Intelligent Telegram Alert Decision
    let telegramText: string | null = null;
    let shouldNotify = false;

    // We do NOT send Telegram alerts for automated bots / crawlers
    if (!userAgent.isBot) {
      switch (rawEvent.eventType) {
        case "NEW_VISITOR":
          if (!sessionState.notifiedLanding) {
            sessionState.notifiedLanding = true;
            telegramText = formatNewVisitorMessage(eventData);
            shouldNotify = true;
          }
          break;

        case "RETURNING_VISITOR":
          if (!sessionState.notifiedLanding) {
            sessionState.notifiedLanding = true;
            telegramText = formatReturningVisitorMessage(eventData);
            shouldNotify = true;
          }
          break;

        case "ENTITY_VIEW":
          if (rawEvent.entityName) {
            const entityKey = `${rawEvent.entityType || "ENTITY"}:${rawEvent.entitySlug || rawEvent.entityName}`;
            if (!sessionState.notifiedEntities.has(entityKey)) {
              sessionState.notifiedEntities.add(entityKey);
              telegramText = formatEntityViewMessage(eventData);
              shouldNotify = true;
            }
          }
          break;

        case "SEARCH":
          if (rawEvent.searchQuery && rawEvent.searchQuery.trim().length >= 2) {
            const queryNorm = rawEvent.searchQuery.trim().toLowerCase();
            if (!sessionState.notifiedSearches.has(queryNorm)) {
              sessionState.notifiedSearches.add(queryNorm);
              telegramText = formatSiteSearchMessage(eventData);
              shouldNotify = true;
            }
          }
          break;

        case "HIGH_VALUE":
          const actionKey = `${rawEvent.actionName || "ACTION"}:${rawEvent.path}`;
          if (!sessionState.notifiedHighValue.has(actionKey)) {
            sessionState.notifiedHighValue.add(actionKey);
            telegramText = formatHighValueActivityMessage(eventData);
            shouldNotify = true;
          }
          break;

        case "SESSION_SUMMARY":
          if (!sessionState.summarySent) {
            const totalPages = rawEvent.pagesCount || (rawEvent.navigationPath ? rawEvent.navigationPath.length : 1);
            const totalActions = rawEvent.actionsPerformed ? rawEvent.actionsPerformed.length : 0;
            // Only send summary if visitor engaged beyond a trivial 1-second single pageview
            if (totalPages >= 2 || totalActions >= 1 || (rawEvent.durationSeconds && rawEvent.durationSeconds >= 15)) {
              sessionState.summarySent = true;
              telegramText = formatSessionSummaryMessage(eventData);
              shouldNotify = true;
            }
          }
          break;

        case "PAGE_VIEW":
          // If this is the very first event in a session and landing wasn't sent yet
          if (!sessionState.notifiedLanding) {
            sessionState.notifiedLanding = true;
            telegramText = rawEvent.isReturning
              ? formatReturningVisitorMessage(eventData)
              : formatNewVisitorMessage(eventData);
            shouldNotify = true;
          }
          break;
      }
    }

    let telegramSent = false;
    if (shouldNotify && telegramText) {
      telegramSent = await sendTelegramNotification(telegramText);
    }

    // 2. Persist to Supabase if configured (Asynchronous, Non-blocking)
    const client = getServiceClient();
    if (client) {
      try {
        // Upsert Session
        await client.from("visitor_sessions").upsert(
          {
            id: rawEvent.sessionId,
            visitor_id: rawEvent.visitorId,
            is_returning: Boolean(rawEvent.isReturning),
            session_number: rawEvent.sessionNumber || 1,
            last_seen_at: new Date().toISOString(),
            duration_seconds: rawEvent.durationSeconds || 0,
            pageview_count: rawEvent.pagesCount || 1,
            landing_path: rawEvent.path,
            referrer: rawEvent.referrer || null,
            referring_domain: source.referrerDomain || null,
            source: source.sourceName,
            medium: source.medium || null,
            campaign: source.campaign || null,
            term: source.term || null,
            content: source.content || null,
            channel: source.channel,
            device_category: userAgent.deviceCategory,
            operating_system: userAgent.operatingSystem,
            browser: userAgent.browser,
            browser_version: userAgent.browserVersion || null,
            viewport: rawEvent.viewport || null,
            screen: rawEvent.screen || null,
            language: rawEvent.language || null,
            timezone: location.timezone || null,
            country: location.country || null,
            region: location.region || null,
            city: location.city || null,
            ip_hash: ipHash,
            entities_viewed: rawEvent.entitiesViewed || [],
            searches_performed: rawEvent.searchesPerformed || [],
            navigation_path: rawEvent.navigationPath || [rawEvent.path],
            updated_at: new Date().toISOString()
          },
          { onConflict: "id" }
        );

        // Insert Event
        await client.from("visitor_events").insert({
          session_id: rawEvent.sessionId,
          visitor_id: rawEvent.visitorId,
          event_type: rawEvent.eventType,
          occurred_at: rawEvent.occurredAt || new Date().toISOString(),
          path: rawEvent.path,
          page_title: rawEvent.pageTitle || null,
          page_type: pageType,
          entity_type: rawEvent.entityType || null,
          entity_id: null,
          entity_name: rawEvent.entityName || null,
          entity_slug: rawEvent.entitySlug || null,
          entity_metadata: rawEvent.entityMetadata || {},
          search_query: rawEvent.searchQuery || null,
          search_results_count: rawEvent.searchResultsCount ?? null,
          search_selected_result: rawEvent.searchSelectedResult || null,
          interaction_name: rawEvent.actionName || null,
          interaction_target: rawEvent.actionDetails || null,
          time_spent_seconds: rawEvent.timeSpentSeconds || null,
          scroll_depth_percent: rawEvent.scrollDepthPercent || null,
          source: source.sourceName,
          medium: source.medium || null,
          campaign: source.campaign || null,
          referrer: rawEvent.referrer || null,
          device_category: userAgent.deviceCategory,
          operating_system: userAgent.operatingSystem,
          browser: userAgent.browser,
          viewport: rawEvent.viewport || null,
          language: rawEvent.language || null,
          timezone: location.timezone || null,
          country: location.country || null,
          region: location.region || null,
          city: location.city || null,
          metadata: {
            isBot: userAgent.isBot,
            botName: userAgent.botName,
            leadData: rawEvent.leadData
          },
          telegram_notified: telegramSent
        });
      } catch (dbErr) {
        // Non-blocking database failure
        console.warn("[Visitor Intelligence DB Exception]", dbErr);
      }
    }

    return { success: true, telegramSent };
  } catch (err: any) {
    console.error("[Visitor Intelligence Processing Error]", err);
    return { success: false, telegramSent: false, error: err?.message || "Unknown error" };
  }
}
