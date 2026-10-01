/**
 * Telegram Visitor Intelligence Message Formatter
 * CONSTRUCTIONS by AiXLuxury
 *
 * Implements clean, professional, mobile-readable HTML operational message templates.
 */

import { ParsedLocation, ParsedSource, ParsedUserAgent } from "./visitor-parser";

export interface VisitorEventData {
  sessionId: string;
  visitorId: string;
  isReturning?: boolean;
  sessionNumber?: number;
  occurredAt?: string | Date;
  timezone?: string;
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
  projectsViewed?: string[];
  searchesPerformed?: string[];
  actionsPerformed?: string[];
  pagesCount?: number;
  durationSeconds?: number;
  timeSpentSeconds?: number;
  viewport?: string;
  language?: string;
  userAgent?: ParsedUserAgent;
  source?: ParsedSource;
  location?: ParsedLocation;
}

export function escapeHtml(str?: string | null): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatTimestamp(dateInput?: string | Date, tz = "Europe/Bucharest"): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) {
    return new Date().toISOString();
  }

  try {
    const day = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: tz });
    const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: tz });
    return `${day} • ${time} • ${tz}`;
  } catch {
    return d.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  }
}

export function formatDuration(seconds = 0): string {
  if (!seconds || seconds <= 0) return "00s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

function maskId(id?: string): string {
  if (!id) return "••••••••";
  if (id.length <= 8) return id;
  return id.substring(0, 6) + "••••";
}

const BRAND_HEADER = [
  "━━━━━━━━━━━━━━━━━━━━",
  "🏗️ <b>CONSTRUCTIONS by AiXLuxury</b>",
  "🌐 <a href=\"https://constructions.cristianvaduva.com\">constructions.cristianvaduva.com</a>",
  "━━━━━━━━━━━━━━━━━━━━"
].join("\n");

const FOOTER_LINE = "━━━━━━━━━━━━━━━━━━━━";

/**
 * Generates structured Telegram notification for NEW VISITOR.
 */
export function formatNewVisitorMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  const loc = data.location?.displayLocation || "Location: unavailable";
  const src = data.source?.displaySummary || "Direct / Unknown";
  const ref = data.source?.referrerDomain || "—";
  const dev = data.userAgent ? `${data.userAgent.deviceCategory} • ${data.userAgent.operatingSystem} • ${data.userAgent.browser}` : "Desktop";
  const vp = data.viewport ? `Viewport: ${data.viewport}` : null;
  const lang = data.language ? `Language: ${data.language}` : null;

  const lines = [
    BRAND_HEADER,
    "🟢 <b>NEW VISITOR</b>",
    "",
    "🕒 <b>TIME</b>",
    time,
    "",
    "📍 <b>LOCATION</b>",
    loc,
    data.location?.isAvailable ? "<i>Approximate geographic area</i>" : null,
    "",
    "📡 <b>SOURCE</b>",
    src,
    data.source?.campaign ? `Campaign: ${escapeHtml(data.source.campaign)}` : null,
    ref !== "—" ? `Referrer: ${escapeHtml(ref)}` : null,
    "",
    "💻 <b>DEVICE</b>",
    dev,
    vp,
    lang,
    "",
    "🔗 <b>LANDING PAGE</b>",
    escapeHtml(data.path || "/"),
    data.entityName ? `🏢 <b>ENTITY:</b> ${escapeHtml(data.entityName)}` : null,
    "",
    `🆔 <b>SESSION:</b> <code>${maskId(data.sessionId)}</code>`,
    FOOTER_LINE
  ].filter((l): l is string => l !== null);

  return lines.join("\n");
}

/**
 * Generates structured Telegram notification for RETURNING VISITOR.
 */
export function formatReturningVisitorMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  const loc = data.location?.displayLocation || "Location: unavailable";
  const src = data.source?.displaySummary || "Direct / Unknown";
  const dev = data.userAgent ? `${data.userAgent.deviceCategory} • ${data.userAgent.operatingSystem} • ${data.userAgent.browser}` : "Desktop";
  const sessionNum = data.sessionNumber ? `Session #${data.sessionNumber}` : "Returning Visitor";

  const lines = [
    BRAND_HEADER,
    "↩️ <b>RETURNING VISITOR</b>",
    "",
    `👤 <b>STATUS:</b> ${sessionNum}`,
    "",
    "🕒 <b>TIME</b>",
    time,
    "",
    "📍 <b>LOCATION</b>",
    loc,
    "",
    "📡 <b>SOURCE</b>",
    src,
    "",
    "💻 <b>DEVICE</b>",
    dev,
    "",
    "🔗 <b>CURRENT PAGE</b>",
    escapeHtml(data.path || "/"),
    data.entityName ? `🏢 <b>ENTITY:</b> ${escapeHtml(data.entityName)}` : null,
    "",
    `🆔 <b>SESSION:</b> <code>${maskId(data.sessionId)}</code>`,
    FOOTER_LINE
  ].filter((l): l is string => l !== null);

  return lines.join("\n");
}

/**
 * Generates structured Telegram notification for ENTITY / PAGE VIEW.
 */
export function formatEntityViewMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  let icon = "👀";
  let title = "PAGE VIEW";

  if (data.entityType === "COMPANY") {
    icon = "🏢";
    title = "COMPANY DOSSIER INSPECTION";
  } else if (data.entityType === "PROJECT") {
    icon = "🏗️";
    title = "PROJECT DOSSIER INSPECTION";
  } else if (data.entityType === "CITY") {
    icon = "📍";
    title = "CITY INTELLIGENCE INSPECTION";
  }

  const lines = [
    BRAND_HEADER,
    `${icon} <b>${title}</b>`,
    "",
    data.entityName ? `<b>Entity:</b> ${escapeHtml(data.entityName)}` : null,
    data.entitySlug ? `<b>Slug:</b> <code>${escapeHtml(data.entitySlug)}</code>` : null,
    `<b>Route:</b> ${escapeHtml(data.path)}`,
    data.timeSpentSeconds ? `<b>Time Spent:</b> ${formatDuration(data.timeSpentSeconds)}` : null,
    "",
    "🕒 <b>TIME</b>",
    time,
    "",
    "📍 <b>LOCATION</b>",
    data.location?.displayLocation || "Location: unavailable",
    "",
    "📡 <b>SOURCE</b>",
    data.source?.displaySummary || "Direct / Unknown",
    "",
    "💻 <b>DEVICE</b>",
    data.userAgent ? `${data.userAgent.deviceCategory} • ${data.userAgent.operatingSystem} • ${data.userAgent.browser}` : "Desktop",
    "",
    `🆔 <b>SESSION:</b> <code>${maskId(data.sessionId)}</code>`,
    FOOTER_LINE
  ].filter((l): l is string => l !== null);

  return lines.join("\n");
}

/**
 * Generates structured Telegram notification for SITE SEARCH.
 */
export function formatSiteSearchMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  const count = data.searchResultsCount !== undefined ? data.searchResultsCount : "—";

  const lines = [
    BRAND_HEADER,
    "🔎 <b>SITE SEARCH</b>",
    "",
    `<b>Query:</b> "<b>${escapeHtml(data.searchQuery || "")}</b>"`,
    `<b>Verified Results:</b> ${count}`,
    data.searchSelectedResult ? `<b>Selected Result:</b> ${escapeHtml(data.searchSelectedResult)}` : null,
    `<b>Context:</b> ${escapeHtml(data.path || "/search")}`,
    "",
    "🕒 <b>TIME</b>",
    time,
    "",
    "📍 <b>LOCATION</b>",
    data.location?.displayLocation || "Location: unavailable",
    "",
    "📡 <b>SOURCE</b>",
    data.source?.displaySummary || "Direct / Unknown",
    "",
    "💻 <b>DEVICE</b>",
    data.userAgent ? `${data.userAgent.deviceCategory} • ${data.userAgent.operatingSystem}` : "Desktop",
    "",
    `🆔 <b>SESSION:</b> <code>${maskId(data.sessionId)}</code>`,
    FOOTER_LINE
  ].filter((l): l is string => l !== null);

  return lines.join("\n");
}

/**
 * Generates structured Telegram notification for HIGH-VALUE ACTIVITY.
 */
export function formatHighValueActivityMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");

  const lines = [
    BRAND_HEADER,
    "🔥 <b>HIGH-VALUE ACTIVITY</b>",
    "",
    `🎯 <b>ACTION:</b> <b>${escapeHtml(data.actionName || "Commercial CTA Clicked")}</b>`,
    data.actionDetails ? `<b>Details:</b> ${escapeHtml(data.actionDetails)}` : null,
    data.entityName ? `<b>Target Entity:</b> ${escapeHtml(data.entityName)}` : null,
    `<b>Page:</b> ${escapeHtml(data.path)}`,
    "",
    data.leadData?.name ? `👤 <b>Name:</b> ${escapeHtml(data.leadData.name)}` : null,
    data.leadData?.email ? `📧 <b>Email:</b> ${escapeHtml(data.leadData.email)}` : null,
    data.leadData?.company ? `🏢 <b>Company:</b> ${escapeHtml(data.leadData.company)}` : null,
    data.leadData?.phone ? `📞 <b>Phone:</b> ${escapeHtml(data.leadData.phone)}` : null,
    data.leadData?.requestType ? `📋 <b>Category:</b> ${escapeHtml(data.leadData.requestType)}` : null,
    data.leadData?.name ? "" : null,
    "🕒 <b>TIME</b>",
    time,
    "",
    "📍 <b>LOCATION</b>",
    data.location?.displayLocation || "Location: unavailable",
    "",
    "📡 <b>SOURCE</b>",
    data.source?.displaySummary || "Direct / Unknown",
    "",
    "💻 <b>DEVICE</b>",
    data.userAgent ? `${data.userAgent.deviceCategory} • ${data.userAgent.operatingSystem} • ${data.userAgent.browser}` : "Desktop",
    "",
    `🆔 <b>SESSION:</b> <code>${maskId(data.sessionId)}</code>`,
    FOOTER_LINE
  ].filter((l): l is string => l !== null);

  return lines.join("\n");
}

/**
 * Generates structured Telegram notification for SESSION SUMMARY.
 */
export function formatSessionSummaryMessage(data: VisitorEventData): string {
  const dur = formatDuration(data.durationSeconds || 0);
  const pages = data.pagesCount || (data.navigationPath ? data.navigationPath.length : 1);
  const loc = data.location?.displayLocation || "Location: unavailable";
  const dev = data.userAgent ? `${data.userAgent.deviceCategory} • ${data.userAgent.operatingSystem} • ${data.userAgent.browser}` : "Desktop";
  const src = data.source?.displaySummary || "Direct / Unknown";

  let navPathText = "—";
  if (data.navigationPath && data.navigationPath.length > 0) {
    navPathText = data.navigationPath
      .map(p => escapeHtml(p))
      .slice(0, 10)
      .join("\n→ ");
    if (data.navigationPath.length > 10) {
      navPathText += `\n→ ... (+ ${data.navigationPath.length - 10} more)`;
    }
  }

  const lines = [
    BRAND_HEADER,
    "📊 <b>SESSION SUMMARY</b>",
    "",
    `⏱️ <b>Duration:</b> ${dur}`,
    `📄 <b>Pages Viewed:</b> ${pages}`,
    `📍 <b>Location:</b> ${loc}`,
    `💻 <b>Device:</b> ${dev}`,
    `📡 <b>Source:</b> ${src}`,
    "",
    "🧭 <b>NAVIGATION PATH</b>",
    navPathText,
    "",
    data.searchesPerformed && data.searchesPerformed.length > 0
      ? `🔎 <b>Searches:</b> ${data.searchesPerformed.map(s => `"${escapeHtml(s)}"`).join(", ")}\n`
      : null,
    data.entitiesViewed && data.entitiesViewed.length > 0
      ? `🏢 <b>Entities Researched:</b> ${data.entitiesViewed.map(e => escapeHtml(e)).join(", ")}\n`
      : null,
    data.actionsPerformed && data.actionsPerformed.length > 0
      ? `🎯 <b>Actions Taken:</b> ${data.actionsPerformed.map(a => escapeHtml(a)).join(", ")}\n`
      : null,
    `🆔 <b>SESSION:</b> <code>${maskId(data.sessionId)}</code>`,
    FOOTER_LINE
  ].filter((l): l is string => l !== null);

  return lines.join("\n");
}
