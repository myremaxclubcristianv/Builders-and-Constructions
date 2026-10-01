/**
 * CONSTRUCTIONS by AiXLuxury — Telegram Notification Formatter
 * 
 * Formats visitor telemetry and commercial lead submissions into structured,
 * executive-grade HTML messages for the internal Telegram channel.
 * 
 * Rules:
 * 1. Safe HTML escaping for all user-supplied inputs (&, <, >, ")
 * 2. Strict PII minimization on abandonment events (field names only, no values)
 * 3. Structured visual hierarchy with scannable sections
 * 4. Contextual specialized lead headers (Real Estate, Credit, Insurance, General)
 * 5. No fabricated details — unprovided fields marked "Not provided" / "Not available"
 */

export interface VisitorUserAgent {
  deviceCategory: string;
  operatingSystem: string;
  browser: string;
  browserVersion?: string;
  isBot?: boolean;
  botName?: string;
}

export interface VisitorSource {
  sourceName: string;
  displaySummary: string;
  channel: string;
  referrerDomain?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface VisitorLocation {
  city?: string;
  region?: string;
  country?: string;
  displayLocation: string;
  timezone?: string;
}

export interface VisitorEventData {
  sessionId: string;
  visitorId?: string;
  isReturning?: boolean;
  sessionNumber?: number;
  occurredAt?: string;
  path?: string;
  previousPath?: string;
  pageTitle?: string;
  pageType?: string;
  entityType?: string;
  entityName?: string;
  entitySlug?: string;
  serviceName?: string;
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
  viewport?: string;
  language?: string;
  timezone?: string;
  userAgent?: VisitorUserAgent;
  source?: VisitorSource;
  location?: VisitorLocation;
}

export interface LeadTelegramData {
  leadId: string;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  companyName?: string | null;
  companyRole?: string | null;
  serviceInterest: string;
  serviceCategory?: string | null;
  preferredContact?: string | null;
  urgency?: string | null;
  message?: string | null;
  projectName?: string | null;
  projectType?: string | null;
  projectStage?: string | null;
  projectLocation?: string | null;
  propertyLocation?: string | null;
  financingInterest?: string | null;
  insuranceInterest?: string | null;
  visitorId?: string | null;
  sessionId?: string | null;
  landingPath?: string | null;
  previousPath?: string | null;
  source?: string | null;
  deviceCategory?: string | null;
  browser?: string | null;
  os?: string | null;
  sessionDuration?: string | null;
  submittedAt?: string | null;
  serviceSpecificData?: Record<string, any> | null;
}

/**
 * Escapes characters that have special meaning in Telegram HTML parse mode.
 */
export function escapeHtml(text: string | null | undefined): string {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function maskId(id: string | null | undefined): string {
  if (!id) return "UNKNOWN";
  if (id.length <= 10) return id;
  return id.substring(0, 10).toUpperCase();
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatTimestamp(dateStr?: string | null, tz = "Europe/Bucharest"): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) return "Unknown Time";
  try {
    return new Intl.DateTimeFormat("ro-RO", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(d);
  } catch {
    return d.toLocaleTimeString();
  }
}

/**
 * 🟢 NEW VISITOR
 */
export function formatNewVisitorMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  const loc = data.location?.displayLocation || "Not available";
  const src = data.source?.displaySummary || "Direct";
  const dev = data.userAgent?.deviceCategory || "Desktop";
  const browser = data.userAgent?.browser || "Safari";
  const os = data.userAgent?.operatingSystem || "macOS";
  const visitorState = data.isReturning ? "RETURNING" : "NEW";
  const session = maskId(data.sessionId || data.visitorId);

  return [
    "🟢 <b>NEW VISITOR</b>",
    "",
    "🌐 <b>CONSTRUCTIONS by AiXLuxury</b>",
    "",
    "<b>Page:</b>",
    `<code>${escapeHtml(data.path || "/")}</code>`,
    "",
    "<b>Visitor:</b>",
    `<code>${visitorState}</code>`,
    "",
    "<b>Device:</b>",
    `<code>${escapeHtml(dev)}</code>`,
    "",
    "<b>Browser:</b>",
    `<code>${escapeHtml(browser)}</code>`,
    "",
    "<b>OS:</b>",
    `<code>${escapeHtml(os)}</code>`,
    "",
    "<b>Location:</b>",
    `<code>${escapeHtml(loc)}</code>`,
    "",
    "<b>Session:</b>",
    `<code>${escapeHtml(session)}</code>`,
    "",
    "<b>Time:</b>",
    `<code>${escapeHtml(time)}</code>`,
    "",
    "<b>Source:</b>",
    `<code>${escapeHtml(src)}</code>`
  ].join("\n");
}

/**
 * 👁 VISITOR (Page Navigation)
 */
export function formatPageViewMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  const loc = data.location?.displayLocation || "Not available";
  const src = data.source?.displaySummary || "Direct";
  const dev = data.userAgent?.deviceCategory || "Desktop";
  const browser = data.userAgent?.browser || "Safari";
  const visitor = maskId(data.visitorId || data.sessionId);
  const prev = data.previousPath || "/";

  const lines = [
    "👁 <b>VISITOR</b>",
    "",
    "<b>CONSTRUCTIONS by AiXLuxury</b>",
    "",
    "<b>Page viewed:</b>",
    `<code>${escapeHtml(data.path || "/")}</code>`,
    "",
    data.pageTitle ? `<b>Title:</b>\n<code>${escapeHtml(data.pageTitle)}</code>\n` : null,
    "<b>Visitor:</b>",
    `<code>${escapeHtml(visitor)}</code>`,
    "",
    "<b>Previous page:</b>",
    `<code>${escapeHtml(prev)}</code>`,
    "",
    "<b>Device:</b>",
    `<code>${escapeHtml(dev)}</code>`,
    "",
    "<b>Browser:</b>",
    `<code>${escapeHtml(browser)}</code>`,
    "",
    "<b>Location:</b>",
    `<code>${escapeHtml(loc)}</code>`,
    "",
    "<b>Source:</b>",
    `<code>${escapeHtml(src)}</code>`,
    "",
    "<b>Time:</b>",
    `<code>${escapeHtml(time)}</code>`
  ].filter((l): l is string => l !== null);

  return lines.join("\n");
}

/**
 * 🔥 SERVICE INTEREST
 */
export function formatServiceInterestMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  const loc = data.location?.displayLocation || "Not available";
  const src = data.source?.displaySummary || "Direct";
  const dev = data.userAgent?.deviceCategory || "Desktop";
  const visitor = maskId(data.visitorId || data.sessionId);
  const prev = data.previousPath || "/";
  const service = data.serviceName || data.entityName || "Commercial Service";

  return [
    "🔥 <b>SERVICE INTEREST</b>",
    "",
    "<b>CONSTRUCTIONS by AiXLuxury</b>",
    "",
    "<b>Visitor opened:</b>",
    `<code>${escapeHtml(data.path || "/services")}</code>`,
    "",
    "<b>Service:</b>",
    `<code>${escapeHtml(service)}</code>`,
    "",
    "<b>Visitor:</b>",
    `<code>${escapeHtml(visitor)}</code>`,
    "",
    "<b>Previous page:</b>",
    `<code>${escapeHtml(prev)}</code>`,
    "",
    "<b>Device:</b>",
    `<code>${escapeHtml(dev)}</code>`,
    "",
    "<b>Location:</b>",
    `<code>${escapeHtml(loc)}</code>`,
    "",
    "<b>Source:</b>",
    `<code>${escapeHtml(src)}</code>`,
    "",
    "<b>Time:</b>",
    `<code>${escapeHtml(time)}</code>`
  ].join("\n");
}

/**
 * 🏗 PROJECT / COMPANY INTEREST
 */
export function formatProjectCompanyInterestMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  const loc = data.location?.displayLocation || "Not available";
  const src = data.source?.displaySummary || "Direct";
  const dev = data.userAgent?.deviceCategory || "Desktop";
  const visitor = maskId(data.visitorId || data.sessionId);
  const prev = data.previousPath || "/";

  const lines = [
    "🏗 <b>PROJECT / COMPANY INTEREST</b>",
    "",
    "<b>CONSTRUCTIONS by AiXLuxury</b>",
    "",
    "<b>Page:</b>",
    `<code>${escapeHtml(data.path || "/")}</code>`,
    "",
    data.entityName ? `<b>Entity:</b>\n<code>${escapeHtml(data.entityName)}</code> (${escapeHtml(data.entityType || "Entity")})\n` : null,
    "<b>Visitor:</b>",
    `<code>${escapeHtml(visitor)}</code>`,
    "",
    "<b>Previous page:</b>",
    `<code>${escapeHtml(prev)}</code>`,
    "",
    "<b>Device:</b>",
    `<code>${escapeHtml(dev)}</code>`,
    "",
    "<b>Location:</b>",
    `<code>${escapeHtml(loc)}</code>`,
    "",
    "<b>Source:</b>",
    `<code>${escapeHtml(src)}</code>`,
    "",
    "<b>Time:</b>",
    `<code>${escapeHtml(time)}</code>`
  ].filter((l): l is string => l !== null);

  return lines.join("\n");
}

/**
 * 🔥 HIGH INTENT VISITOR
 */
export function formatHighIntentVisitorMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  const loc = data.location?.displayLocation || "Not available";
  const src = data.source?.displaySummary || "Direct";
  const dev = data.userAgent?.deviceCategory || "Desktop";
  const visitor = maskId(data.visitorId || data.sessionId);
  const duration = formatDuration(data.durationSeconds || 0);
  const activity = data.intentReason || data.actionDetails || "Multi-service research / high commercial engagement";

  return [
    "🔥 <b>HIGH INTENT VISITOR</b>",
    "",
    "<b>CONSTRUCTIONS by AiXLuxury</b>",
    "",
    "<b>Visitor:</b>",
    `<code>${escapeHtml(visitor)}</code>`,
    "",
    "<b>Observed activity:</b>",
    `<code>${escapeHtml(activity)}</code>`,
    "",
    "<b>Last page:</b>",
    `<code>${escapeHtml(data.path || "/")}</code>`,
    "",
    "<b>Session duration:</b>",
    `<code>${escapeHtml(duration)}</code>`,
    "",
    "<b>Source:</b>",
    `<code>${escapeHtml(src)}</code>`,
    "",
    "<b>Device:</b>",
    `<code>${escapeHtml(dev)}</code>`,
    "",
    "<b>Location:</b>",
    `<code>${escapeHtml(loc)}</code>`,
    "",
    "<b>Time:</b>",
    `<code>${escapeHtml(time)}</code>`
  ].join("\n");
}

/**
 * 📝 CONTACT FORM STARTED
 */
export function formatFormStartedMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  const src = data.source?.displaySummary || "Direct";
  const dev = data.userAgent?.deviceCategory || "Desktop";
  const visitor = maskId(data.visitorId || data.sessionId);
  const interest = data.actionDetails || "General contact";

  return [
    "📝 <b>CONTACT FORM STARTED</b>",
    "",
    "<b>CONSTRUCTIONS by AiXLuxury</b>",
    "",
    "<b>Visitor:</b>",
    `<code>${escapeHtml(visitor)}</code>`,
    "",
    "<b>Page:</b>",
    `<code>${escapeHtml(data.path || "/")}</code>`,
    "",
    "<b>Interest:</b>",
    `<code>${escapeHtml(interest)}</code>`,
    "",
    "<b>Device:</b>",
    `<code>${escapeHtml(dev)}</code>`,
    "",
    "<b>Source:</b>",
    `<code>${escapeHtml(src)}</code>`,
    "",
    "<b>Time:</b>",
    `<code>${escapeHtml(time)}</code>`
  ].join("\n");
}

/**
 * ⚠️ CONTACT FORM ABANDONED (Strict PII minimization: field names only)
 */
export function formatFormAbandonedMessage(data: VisitorEventData): string {
  const time = formatTimestamp(data.occurredAt, data.timezone || data.location?.timezone || "Europe/Bucharest");
  const visitor = maskId(data.visitorId || data.sessionId);
  const fieldsCompleted = data.actionDetails || "None";

  return [
    "⚠️ <b>CONTACT FORM ABANDONED</b>",
    "",
    "<b>CONSTRUCTIONS by AiXLuxury</b>",
    "",
    "<b>Visitor:</b>",
    `<code>${escapeHtml(visitor)}</code>`,
    "",
    "<b>Fields completed:</b>",
    `<code>${escapeHtml(fieldsCompleted)}</code>`,
    "",
    "<b>Last page:</b>",
    `<code>${escapeHtml(data.path || "/")}</code>`,
    "",
    "<b>Time:</b>",
    `<code>${escapeHtml(time)}</code>`
  ].join("\n");
}

/**
 * Formats lead notifications into structured Telegram messages.
 * Supports Real Estate, Credit, Insurance, and General Commercial variations.
 */
export function formatLeadTelegramMessage(lead: LeadTelegramData): string {
  const time = formatTimestamp(lead.submittedAt, "Europe/Bucharest");
  const interest = lead.serviceInterest || "General contact";
  const interestLower = interest.toLowerCase();

  // 1. REAL ESTATE LEAD
  if (
    interestLower.includes("real estate") ||
    interestLower.includes("imobiliare") ||
    interestLower.includes("proprietate") ||
    interestLower === "real-estate-sales"
  ) {
    return [
      "🏠 <b>NEW REAL ESTATE LEAD</b>",
      "━━━━━━━━━━━━━━━━━━",
      "👤 <b>CONTACT</b>",
      "Name:",
      `<code>${escapeHtml(lead.fullName)}</code>`,
      "Phone:",
      `<code>${escapeHtml(lead.phone || "Not provided")}</code>`,
      "Email:",
      `<code>${escapeHtml(lead.email || "Not provided")}</code>`,
      ...(lead.companyName ? ["Company:", `<code>${escapeHtml(lead.companyName)}</code>`] : []),
      "━━━━━━━━━━━━━━━━━━",
      "🎯 <b>REAL ESTATE INTEREST</b>",
      "Interest:",
      `<code>${escapeHtml(interest)}</code>`,
      ...(lead.projectName ? ["Property / Project:", `<code>${escapeHtml(lead.projectName)}</code>`] : []),
      ...(lead.projectLocation || lead.propertyLocation
        ? ["Location:", `<code>${escapeHtml(lead.projectLocation || lead.propertyLocation || "")}</code>`]
        : []),
      ...(lead.projectType ? ["Property type:", `<code>${escapeHtml(lead.projectType)}</code>`] : []),
      ...(lead.message ? ["Message:", `<code>${escapeHtml(lead.message)}</code>`] : []),
      "━━━━━━━━━━━━━━━━━━",
      "🌐 <b>VISITOR INTELLIGENCE</b>",
      "Visitor:",
      `<code>${escapeHtml(lead.visitorId || maskId(lead.sessionId))}</code>`,
      "Source:",
      `<code>${escapeHtml(lead.source || "Direct")}</code>`,
      "Page:",
      `<code>${escapeHtml(lead.landingPath || "/services/vanzari-real-estate")}</code>`,
      "━━━━━━━━━━━━━━━━━━",
      "🆔 <b>LEAD</b>",
      `<code>${escapeHtml(lead.leadId)}</code>`,
      "Time:",
      `<code>${escapeHtml(time)}</code>`,
      "━━━━━━━━━━━━━━━━━━",
      "CONSTRUCTIONS by AiXLuxury"
    ].join("\n");
  }

  // 2. CREDIT / FINANCING LEAD
  if (
    interestLower.includes("credit") ||
    interestLower.includes("finanțare") ||
    interestLower.includes("finantare") ||
    interestLower === "credit-financing"
  ) {
    return [
      "💰 <b>NEW CREDIT LEAD</b>",
      "━━━━━━━━━━━━━━━━━━",
      "👤 <b>CONTACT</b>",
      "Name:",
      `<code>${escapeHtml(lead.fullName)}</code>`,
      "Phone:",
      `<code>${escapeHtml(lead.phone || "Not provided")}</code>`,
      "Email:",
      `<code>${escapeHtml(lead.email || "Not provided")}</code>`,
      ...(lead.companyName ? ["Company:", `<code>${escapeHtml(lead.companyName)}</code>`] : []),
      "━━━━━━━━━━━━━━━━━━",
      "🎯 <b>FINANCING DETAILS</b>",
      "Financing interest:",
      `<code>${escapeHtml(lead.financingInterest || interest)}</code>`,
      ...(lead.projectName ? ["Project:", `<code>${escapeHtml(lead.projectName)}</code>`] : []),
      ...(lead.projectLocation ? ["Location:", `<code>${escapeHtml(lead.projectLocation)}</code>`] : []),
      "Urgency:",
      `<code>${escapeHtml(lead.urgency || "Normal")}</code>`,
      ...(lead.message ? ["Message:", `<code>${escapeHtml(lead.message)}</code>`] : []),
      "━━━━━━━━━━━━━━━━━━",
      "🌐 <b>VISITOR INTELLIGENCE</b>",
      "Visitor:",
      `<code>${escapeHtml(lead.visitorId || maskId(lead.sessionId))}</code>`,
      "Source:",
      `<code>${escapeHtml(lead.source || "Direct")}</code>`,
      "━━━━━━━━━━━━━━━━━━",
      "🆔 <b>LEAD</b>",
      `<code>${escapeHtml(lead.leadId)}</code>`,
      "Time:",
      `<code>${escapeHtml(time)}</code>`,
      "━━━━━━━━━━━━━━━━━━",
      "CONSTRUCTIONS by AiXLuxury"
    ].join("\n");
  }

  // 3. INSURANCE LEAD
  if (
    interestLower.includes("asigur") ||
    interestLower.includes("insurance") ||
    interestLower === "insurance-brokerage"
  ) {
    return [
      "🛡 <b>NEW INSURANCE LEAD</b>",
      "━━━━━━━━━━━━━━━━━━",
      "👤 <b>CONTACT</b>",
      "Name:",
      `<code>${escapeHtml(lead.fullName)}</code>`,
      "Phone:",
      `<code>${escapeHtml(lead.phone || "Not provided")}</code>`,
      "Email:",
      `<code>${escapeHtml(lead.email || "Not provided")}</code>`,
      ...(lead.companyName ? ["Company:", `<code>${escapeHtml(lead.companyName)}</code>`] : []),
      "━━━━━━━━━━━━━━━━━━",
      "🎯 <b>INSURANCE DETAILS</b>",
      "Insurance interest:",
      `<code>${escapeHtml(lead.insuranceInterest || interest)}</code>`,
      ...(lead.message ? ["Message:", `<code>${escapeHtml(lead.message)}</code>`] : []),
      "━━━━━━━━━━━━━━━━━━",
      "🌐 <b>VISITOR INTELLIGENCE</b>",
      "Visitor:",
      `<code>${escapeHtml(lead.visitorId || maskId(lead.sessionId))}</code>`,
      "Source:",
      `<code>${escapeHtml(lead.source || "Direct")}</code>`,
      "━━━━━━━━━━━━━━━━━━",
      "🆔 <b>LEAD</b>",
      `<code>${escapeHtml(lead.leadId)}</code>`,
      "Time:",
      `<code>${escapeHtml(time)}</code>`,
      "━━━━━━━━━━━━━━━━━━",
      "CONSTRUCTIONS by AiXLuxury"
    ].join("\n");
  }

  // 4. GENERAL / QUALITY / COMMERCIAL LEAD (Section 6 Standard Format)
  const hasProject = Boolean(lead.projectName || lead.projectType || lead.projectStage || lead.projectLocation);

  const contactSection = [
    "👤 <b>CONTACT</b>",
    "Nume:",
    `<code>${escapeHtml(lead.fullName)}</code>`,
    "Telefon:",
    `<code>${escapeHtml(lead.phone || "Not provided")}</code>`,
    "Email:",
    `<code>${escapeHtml(lead.email || "Not provided")}</code>`,
    "Companie:",
    `<code>${escapeHtml(lead.companyName || "Not provided")}</code>`,
    "Rol:",
    `<code>${escapeHtml(lead.companyRole || "Not provided")}</code>`
  ];

  const interestSection = [
    "🎯 <b>INTERES</b>",
    "Serviciu:",
    `<code>${escapeHtml(interest)}</code>`,
    "Urgență:",
    `<code>${escapeHtml(lead.urgency || "Normal")}</code>`,
    "Contact preferat:",
    `<code>${escapeHtml(lead.preferredContact || "Telefon")}</code>`,
    ...(lead.message ? ["Mesaj:", `<code>${escapeHtml(lead.message)}</code>`] : [])
  ];

  const projectSection = hasProject
    ? [
        "━━━━━━━━━━━━━━━━━━",
        "🏗 <b>PROJECT</b>",
        ...(lead.projectName ? ["Proiect:", `<code>${escapeHtml(lead.projectName)}</code>`] : []),
        ...(lead.projectType ? ["Tip:", `<code>${escapeHtml(lead.projectType)}</code>`] : []),
        ...(lead.projectStage ? ["Stadiu:", `<code>${escapeHtml(lead.projectStage)}</code>`] : []),
        ...(lead.projectLocation ? ["Locație:", `<code>${escapeHtml(lead.projectLocation)}</code>`] : [])
      ]
    : [];

  const visitorSection = [
    "🌐 <b>VISITOR INTELLIGENCE</b>",
    "Visitor:",
    `<code>${escapeHtml(lead.visitorId || maskId(lead.sessionId))}</code>`,
    "Landing:",
    `<code>${escapeHtml(lead.landingPath || "/")}</code>`,
    ...(lead.previousPath ? ["Previous:", `<code>${escapeHtml(lead.previousPath)}</code>`] : []),
    "Source:",
    `<code>${escapeHtml(lead.source || "Direct")}</code>`,
    "Device:",
    `<code>${escapeHtml(lead.deviceCategory || "Desktop")}</code>`,
    "Browser:",
    `<code>${escapeHtml(lead.browser || "Safari")}</code>`,
    ...(lead.sessionDuration ? ["Session:", `<code>${escapeHtml(lead.sessionDuration)}</code>`] : [])
  ];

  return [
    "🚨 <b>NEW LEAD — CONSTRUCTIONS</b>",
    "━━━━━━━━━━━━━━━━━━",
    ...contactSection,
    "━━━━━━━━━━━━━━━━━━",
    ...interestSection,
    ...projectSection,
    "━━━━━━━━━━━━━━━━━━",
    ...visitorSection,
    "━━━━━━━━━━━━━━━━━━",
    "🆔 <b>LEAD</b>",
    `<code>${escapeHtml(lead.leadId)}</code>`,
    "Time:",
    `<code>${escapeHtml(time)}</code>`,
    "━━━━━━━━━━━━━━━━━━",
    "CONSTRUCTIONS by AiXLuxury"
  ].join("\n");
}
