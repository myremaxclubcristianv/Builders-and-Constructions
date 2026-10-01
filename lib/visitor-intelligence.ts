/**
 * CONSTRUCTIONS by AiXLuxury — Visitor Intelligence Core Processing Engine
 * 
 * Ingests client-side telemetry events, extracts headers, enriches with geodata,
 * performs intelligent throttling & deduplication, and formats / dispatches
 * operational notifications to Telegram and Supabase.
 */

import { parseUserAgent, parseSourceAttribution, parseVercelGeoHeaders, classifyRoute } from "./visitor-parser";
import {
  VisitorEventData,
  formatNewVisitorMessage,
  formatPageViewMessage,
  formatServiceInterestMessage,
  formatProjectCompanyInterestMessage,
  formatHighIntentVisitorMessage,
  formatFormStartedMessage,
  formatFormAbandonedMessage
} from "./telegram-visitor-formatter";
import { sendTelegramNotification } from "./telegram";
import { getServiceClient } from "./supabase";

export interface RawTelemetryEvent {
  sessionId: string;
  visitorId: string;
  isReturning?: boolean;
  sessionNumber?: number;
  eventType: string; // NEW_VISITOR, RETURNING_VISITOR, PAGE_VIEW, SERVICE_INTEREST, PROJECT_COMPANY_INTEREST, HIGH_INTENT, FORM_STARTED, FORM_ABANDONED, SEARCH, HIGH_VALUE, SESSION_SUMMARY
  path: string;
  previousPath?: string;
  pageTitle?: string;
  entityType?: string;
  entityName?: string;
  entitySlug?: string;
  serviceName?: string;
  entityMetadata?: Record<string, any>;
  referrer?: string;
  searchParams?: Record<string, string>;
  searchQuery?: string;
  searchResultsCount?: number;
  searchSelectedResult?: string;
  actionName?: string;
  actionDetails?: string;
  intentReason?: string;
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
  viewport?: string;
  screen?: string;
  language?: string;
  timezone?: string;
  occurredAt?: string;
}

export interface ProcessingResult {
  success: boolean;
  telegramSent: boolean;
  error?: string;
}

// In-Memory Session Cache for Throttling / Deduplication
interface SessionAlertState {
  notifiedLanding: boolean;
  notifiedPages: Set<string>;
  notifiedServices: Set<string>;
  notifiedEntities: Set<string>;
  notifiedSearches: Set<string>;
  notifiedHighIntent: Set<string>;
  notifiedFormStarted: boolean;
  notifiedFormAbandoned: boolean;
  summarySent: boolean;
  lastEventTime: number;
}

const sessionAlertCache = new Map<string, SessionAlertState>();

// Periodic cache cleanup (sessions older than 2 hours)
setInterval(() => {
  const now = Date.now();
  const twoHoursAgo = now - 2 * 60 * 60 * 1000;
  for (const [sid, state] of sessionAlertCache.entries()) {
    if (state.lastEventTime < twoHoursAgo) {
      sessionAlertCache.delete(sid);
    }
  }
}, 30 * 60 * 1000);

function getSessionAlertState(sessionId: string): SessionAlertState {
  let state = sessionAlertCache.get(sessionId);
  if (!state) {
    state = {
      notifiedLanding: false,
      notifiedPages: new Set<string>(),
      notifiedServices: new Set<string>(),
      notifiedEntities: new Set<string>(),
      notifiedSearches: new Set<string>(),
      notifiedHighIntent: new Set<string>(),
      notifiedFormStarted: false,
      notifiedFormAbandoned: false,
      summarySent: false,
      lastEventTime: Date.now()
    };
    sessionAlertCache.set(sessionId, state);
  }
  state.lastEventTime = Date.now();
  return state;
}

/**
 * Main ingestion handler for visitor events.
 */
export async function processVisitorEvent(
  rawEvent: RawTelemetryEvent,
  headers: Headers
): Promise<ProcessingResult> {
  try {
    const userAgent = parseUserAgent(headers.get("user-agent"));
    const source = parseSourceAttribution(rawEvent.referrer, rawEvent.searchParams);
    const location = parseVercelGeoHeaders(headers);
    const pageType = classifyRoute(rawEvent.path);
    const ip = headers.get("x-real-ip") || headers.get("x-forwarded-for") || "";
    const ipHash = ip ? Buffer.from(ip).toString("base64").substring(0, 16) : null;

    const sessionState = getSessionAlertState(rawEvent.sessionId);

    const eventData: VisitorEventData = {
      sessionId: rawEvent.sessionId,
      visitorId: rawEvent.visitorId,
      isReturning: rawEvent.isReturning,
      sessionNumber: rawEvent.sessionNumber,
      occurredAt: rawEvent.occurredAt || new Date().toISOString(),
      path: rawEvent.path,
      previousPath: rawEvent.previousPath,
      pageTitle: rawEvent.pageTitle,
      pageType,
      entityType: rawEvent.entityType,
      entityName: rawEvent.entityName,
      entitySlug: rawEvent.entitySlug,
      serviceName: rawEvent.serviceName,
      searchQuery: rawEvent.searchQuery,
      searchResultsCount: rawEvent.searchResultsCount,
      searchSelectedResult: rawEvent.searchSelectedResult,
      actionName: rawEvent.actionName,
      actionDetails: rawEvent.actionDetails,
      intentReason: rawEvent.intentReason,
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

    // 1. Intelligent Telegram Alert Decision & Throttling
    let telegramText: string | null = null;
    let shouldNotify = false;

    // Do NOT send Telegram alerts for automated bots / crawlers
    if (!userAgent.isBot) {
      switch (rawEvent.eventType) {
        case "NEW_VISITOR":
        case "RETURNING_VISITOR":
          if (!sessionState.notifiedLanding) {
            sessionState.notifiedLanding = true;
            telegramText = formatNewVisitorMessage(eventData);
            shouldNotify = true;
          }
          break;

        case "SERVICE_INTEREST":
          {
            const serviceKey = rawEvent.path || rawEvent.serviceName || "service";
            if (!sessionState.notifiedServices.has(serviceKey)) {
              sessionState.notifiedServices.add(serviceKey);
              telegramText = formatServiceInterestMessage(eventData);
              shouldNotify = true;
            }
          }
          break;

        case "PROJECT_COMPANY_INTEREST":
        case "ENTITY_VIEW":
          {
            const entityKey = `${rawEvent.entityType || "ENTITY"}:${rawEvent.entitySlug || rawEvent.entityName || rawEvent.path}`;
            if (!sessionState.notifiedEntities.has(entityKey)) {
              sessionState.notifiedEntities.add(entityKey);
              telegramText = formatProjectCompanyInterestMessage(eventData);
              shouldNotify = true;
            }
          }
          break;

        case "HIGH_INTENT":
          {
            const intentKey = rawEvent.intentReason || rawEvent.actionDetails || rawEvent.path;
            if (!sessionState.notifiedHighIntent.has(intentKey)) {
              sessionState.notifiedHighIntent.add(intentKey);
              telegramText = formatHighIntentVisitorMessage(eventData);
              shouldNotify = true;
            }
          }
          break;

        case "FORM_STARTED":
          if (!sessionState.notifiedFormStarted) {
            sessionState.notifiedFormStarted = true;
            telegramText = formatFormStartedMessage(eventData);
            shouldNotify = true;
          }
          break;

        case "FORM_ABANDONED":
          if (!sessionState.notifiedFormAbandoned) {
            sessionState.notifiedFormAbandoned = true;
            telegramText = formatFormAbandonedMessage(eventData);
            shouldNotify = true;
          }
          break;

        case "PAGE_VIEW":
          // If first event and landing was not notified
          if (!sessionState.notifiedLanding) {
            sessionState.notifiedLanding = true;
            telegramText = formatNewVisitorMessage(eventData);
            shouldNotify = true;
          } else {
            // Deduplicate same-page refreshes
            const pathKey = rawEvent.path;
            if (!sessionState.notifiedPages.has(pathKey)) {
              sessionState.notifiedPages.add(pathKey);
              // Notify only if page is not a simple repeat
              telegramText = formatPageViewMessage(eventData);
              shouldNotify = true;
            }
          }
          break;
      }
    }

    let telegramSent = false;
    if (shouldNotify && telegramText) {
      telegramSent = await sendTelegramNotification(telegramText);
      if (!telegramSent) {
        console.error("[TELEGRAM_NOTIFICATION_FAILED]", {
          eventType: rawEvent.eventType,
          sessionId: rawEvent.sessionId,
          path: rawEvent.path,
          timestamp: new Date().toISOString()
        });
      }
    }

    // 2. Persist to Supabase if configured (Asynchronous, Non-blocking)
    const client = getServiceClient();
    if (client) {
      try {
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
        console.warn("[Visitor Intelligence DB Exception]", dbErr);
      }
    }

    return { success: true, telegramSent };
  } catch (err: any) {
    console.error("[Visitor Intelligence Processing Error]", err);
    return { success: false, telegramSent: false, error: err?.message || "Unknown error" };
  }
}

export type IncomingVisitorEvent = RawTelemetryEvent;
export const processVisitorIntelligenceEvent = async (rawEvent: RawTelemetryEvent, headers: Headers, _clientIp?: string) => {
  return processVisitorEvent(rawEvent, headers);
};
