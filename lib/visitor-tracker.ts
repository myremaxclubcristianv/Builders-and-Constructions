/**
 * CONSTRUCTIONS by AiXLuxury — Client-Side Visitor Tracking & Telemetry Hub
 * 
 * Provides lightweight, non-blocking telemetry tracking for:
 * 1. Initial Landing / New vs Returning Visitors
 * 2. Route & Pageview transitions
 * 3. Commercial Service Interest
 * 4. Project & Company Dossier Interest
 * 5. High-Intent Behavioral Thresholds
 * 6. Form Started & Form Abandonment (strictly zero PII)
 * 7. On-site searches and commercial CTA interactions
 */

export interface VisitorSessionState {
  sessionId: string;
  visitorId: string;
  isReturning: boolean;
  sessionNumber: number;
  sessionStartTime: number;
  lastActivityTime: number;
  navigationPath: string[];
  servicePagesViewed: string[];
  entitiesViewed: string[];
  searchesPerformed: string[];
  actionsPerformed: string[];
  hasVisitedEntityDossier: boolean;
}

const STORAGE_KEYS = {
  VISITOR_ID: "c_vid_v2",
  SESSION_ID: "c_sid_v2",
  SESSION_START: "c_sstart_v2",
  SESSION_COUNT: "c_scnt_v2",
  NAV_PATH: "c_navpath_v2",
  SERVICES_PATH: "c_servpath_v2",
  ENTITIES: "c_ent_v2",
  SEARCHES: "c_srch_v2",
  ACTIONS: "c_act_v2"
};

const TELEMETRY_ENDPOINT = "/api/telemetry/events";

function generateSecureId(prefix = "VIS"): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = prefix + "-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function safeGetStorage(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage quota errors
  }
}

let cachedSession: VisitorSessionState | null = null;
let lastPageStartTime = Date.now();
let lastPath = "";

/**
 * Resolves or initializes the current persistent visitor and session identifiers.
 */
export function getOrCreateSession(): VisitorSessionState {
  if (typeof window === "undefined") {
    return {
      sessionId: "server_session",
      visitorId: "server_visitor",
      isReturning: false,
      sessionNumber: 1,
      sessionStartTime: Date.now(),
      lastActivityTime: Date.now(),
      navigationPath: [],
      servicePagesViewed: [],
      entitiesViewed: [],
      searchesPerformed: [],
      actionsPerformed: [],
      hasVisitedEntityDossier: false
    };
  }

  if (cachedSession) {
    cachedSession.lastActivityTime = Date.now();
    return cachedSession;
  }

  // 1. Visitor ID (Persistent across sessions via localStorage)
  let visitorId = safeGetStorage(localStorage, STORAGE_KEYS.VISITOR_ID);
  let isReturning = true;

  if (!visitorId) {
    visitorId = generateSecureId("VIS");
    safeSetStorage(localStorage, STORAGE_KEYS.VISITOR_ID, visitorId);
    isReturning = false;
  }

  // 2. Session Count
  let sessionCount = parseInt(safeGetStorage(localStorage, STORAGE_KEYS.SESSION_COUNT) || "0", 10);

  // 3. Session ID (Per-tab/browser session via sessionStorage)
  let sessionId = safeGetStorage(sessionStorage, STORAGE_KEYS.SESSION_ID);
  let sessionStartTime = parseInt(safeGetStorage(sessionStorage, STORAGE_KEYS.SESSION_START) || "0", 10);

  if (!sessionId) {
    sessionId = generateSecureId("SES");
    sessionStartTime = Date.now();
    sessionCount += 1;
    safeSetStorage(sessionStorage, STORAGE_KEYS.SESSION_ID, sessionId);
    safeSetStorage(sessionStorage, STORAGE_KEYS.SESSION_START, sessionStartTime.toString());
    safeSetStorage(localStorage, STORAGE_KEYS.SESSION_COUNT, sessionCount.toString());
  }

  // 4. Memory / Navigation State
  let navigationPath: string[] = [];
  try {
    const raw = safeGetStorage(sessionStorage, STORAGE_KEYS.NAV_PATH);
    if (raw) navigationPath = JSON.parse(raw);
  } catch {}

  let servicePagesViewed: string[] = [];
  try {
    const raw = safeGetStorage(sessionStorage, STORAGE_KEYS.SERVICES_PATH);
    if (raw) servicePagesViewed = JSON.parse(raw);
  } catch {}

  let entitiesViewed: string[] = [];
  try {
    const raw = safeGetStorage(sessionStorage, STORAGE_KEYS.ENTITIES);
    if (raw) entitiesViewed = JSON.parse(raw);
  } catch {}

  let searchesPerformed: string[] = [];
  try {
    const raw = safeGetStorage(sessionStorage, STORAGE_KEYS.SEARCHES);
    if (raw) searchesPerformed = JSON.parse(raw);
  } catch {}

  let actionsPerformed: string[] = [];
  try {
    const raw = safeGetStorage(sessionStorage, STORAGE_KEYS.ACTIONS);
    if (raw) actionsPerformed = JSON.parse(raw);
  } catch {}

  cachedSession = {
    sessionId,
    visitorId,
    isReturning: isReturning || sessionCount > 1,
    sessionNumber: Math.max(1, sessionCount),
    sessionStartTime: sessionStartTime || Date.now(),
    lastActivityTime: Date.now(),
    navigationPath,
    servicePagesViewed,
    entitiesViewed,
    searchesPerformed,
    actionsPerformed,
    hasVisitedEntityDossier: entitiesViewed.length > 0
  };

  return cachedSession;
}

/**
 * Sends telemetry payload asynchronously without blocking the UI.
 */
function sendTelemetryPayload(payload: Record<string, any>): void {
  if (typeof window === "undefined") return;

  try {
    const body = JSON.stringify(payload);
    fetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(TELEMETRY_ENDPOINT, blob);
      }
    });
  } catch {
    // Non-blocking telemetry failure
  }
}

/**
 * Extracts entity information from URL pathname.
 */
export function extractEntityFromPath(pathname: string): {
  entityType?: "COMPANY" | "PROJECT" | "CITY" | "SERVICE";
  entitySlug?: string;
  entityName?: string;
} {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length >= 2) {
    const section = parts[0].toLowerCase();
    const slug = parts[1];

    if (section === "companies") {
      const formattedName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return { entityType: "COMPANY", entitySlug: slug, entityName: formattedName };
    }

    if (section === "projects") {
      const formattedName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return { entityType: "PROJECT", entitySlug: slug, entityName: formattedName };
    }

    if (section === "cities") {
      const formattedName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return { entityType: "CITY", entitySlug: slug, entityName: formattedName };
    }

    if (section === "services") {
      const formattedName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return { entityType: "SERVICE", entitySlug: slug, entityName: formattedName };
    }
  }
  return {};
}

/**
 * Tracks a pageview / route transition.
 */
export function trackPageView(pathname: string, searchParamsString = ""): void {
  if (typeof window === "undefined") return;

  const session = getOrCreateSession();
  const now = Date.now();
  const timeSpentOnPrevPage = lastPath ? Math.max(1, Math.round((now - lastPageStartTime) / 1000)) : 0;
  const previousPath = lastPath || "/";
  lastPageStartTime = now;
  lastPath = pathname;

  // Update navigation path
  if (!session.navigationPath.includes(pathname)) {
    session.navigationPath.push(pathname);
    safeSetStorage(sessionStorage, STORAGE_KEYS.NAV_PATH, JSON.stringify(session.navigationPath));
  }

  // Check for entity
  const entity = extractEntityFromPath(pathname);
  if (entity.entityName && (entity.entityType === "COMPANY" || entity.entityType === "PROJECT")) {
    session.hasVisitedEntityDossier = true;
    if (!session.entitiesViewed.includes(entity.entityName)) {
      session.entitiesViewed.push(entity.entityName);
      safeSetStorage(sessionStorage, STORAGE_KEYS.ENTITIES, JSON.stringify(session.entitiesViewed));
    }
  }

  // Check for service
  const isServicePage = pathname.startsWith("/services/") && pathname.length > "/services/".length;
  if (isServicePage && !session.servicePagesViewed.includes(pathname)) {
    session.servicePagesViewed.push(pathname);
    safeSetStorage(sessionStorage, STORAGE_KEYS.SERVICES_PATH, JSON.stringify(session.servicePagesViewed));
  }

  const durationSeconds = Math.max(0, Math.round((now - session.sessionStartTime) / 1000));
  const isFirstPage = session.navigationPath.length <= 1;

  let eventType = "PAGE_VIEW";
  if (isFirstPage) {
    eventType = session.isReturning ? "RETURNING_VISITOR" : "NEW_VISITOR";
  } else if (isServicePage) {
    eventType = "SERVICE_INTEREST";
  } else if (entity.entityType === "COMPANY" || entity.entityType === "PROJECT") {
    eventType = "PROJECT_COMPANY_INTEREST";
  }

  const searchParamsObj: Record<string, string> = {};
  if (searchParamsString) {
    const sp = new URLSearchParams(searchParamsString);
    sp.forEach((v, k) => {
      searchParamsObj[k] = v;
    });
  }

  const payload = {
    sessionId: session.sessionId,
    visitorId: session.visitorId,
    isReturning: session.isReturning,
    sessionNumber: session.sessionNumber,
    eventType,
    path: pathname,
    previousPath,
    pageTitle: typeof document !== "undefined" ? document.title : "",
    entityType: entity.entityType,
    entityName: entity.entityName,
    entitySlug: entity.entitySlug,
    serviceName: isServicePage ? (entity.entityName || pathname.replace("/services/", "")) : undefined,
    referrer: typeof document !== "undefined" ? document.referrer : "",
    searchParams: searchParamsObj,
    viewport: typeof window !== "undefined" ? `${window.innerWidth} × ${window.innerHeight}` : undefined,
    screen: typeof window !== "undefined" && window.screen ? `${window.screen.width} × ${window.screen.height}` : undefined,
    language: typeof navigator !== "undefined" ? navigator.language : undefined,
    timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined,
    navigationPath: session.navigationPath,
    entitiesViewed: session.entitiesViewed,
    searchesPerformed: session.searchesPerformed,
    actionsPerformed: session.actionsPerformed,
    pagesCount: session.navigationPath.length,
    durationSeconds,
    timeSpentSeconds: timeSpentOnPrevPage,
    occurredAt: new Date().toISOString()
  };

  sendTelemetryPayload(payload);

  // HIGH INTENT EVALUATION (Documented observable thresholds)
  // Threshold 1: Visited 3 or more distinct commercial service pages
  if (session.servicePagesViewed.length >= 3) {
    trackHighIntent(`${session.servicePagesViewed.length} service pages researched`);
  }
  // Threshold 2: Opened a commercial service page AFTER doing research on company/project dossiers
  else if (isServicePage && session.hasVisitedEntityDossier) {
    trackHighIntent("Commercial service opened after company/project dossier research");
  }
}

/**
 * Tracks when a contact form is opened / started.
 */
export function trackFormStarted(formName: string, interest = "General contact"): void {
  if (typeof window === "undefined") return;

  const session = getOrCreateSession();
  const now = Date.now();
  const durationSeconds = Math.max(0, Math.round((now - session.sessionStartTime) / 1000));

  const payload = {
    sessionId: session.sessionId,
    visitorId: session.visitorId,
    isReturning: session.isReturning,
    sessionNumber: session.sessionNumber,
    eventType: "FORM_STARTED",
    path: window.location.pathname,
    actionName: formName,
    actionDetails: interest,
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigationPath: session.navigationPath,
    pagesCount: session.navigationPath.length,
    durationSeconds,
    occurredAt: new Date().toISOString()
  };

  sendTelemetryPayload(payload);
}

/**
 * Tracks when a user started filling out a form but abandoned it before submission.
 * IMPORTANT: strictly zero PII, only field names (e.g. "Name, Phone, Interest").
 */
export function trackFormAbandoned(formName: string, fieldsCompleted: string[]): void {
  if (typeof window === "undefined" || !fieldsCompleted || fieldsCompleted.length === 0) return;

  const session = getOrCreateSession();
  const now = Date.now();
  const durationSeconds = Math.max(0, Math.round((now - session.sessionStartTime) / 1000));

  const payload = {
    sessionId: session.sessionId,
    visitorId: session.visitorId,
    isReturning: session.isReturning,
    sessionNumber: session.sessionNumber,
    eventType: "FORM_ABANDONED",
    path: window.location.pathname,
    actionName: formName,
    actionDetails: fieldsCompleted.join(", "),
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigationPath: session.navigationPath,
    pagesCount: session.navigationPath.length,
    durationSeconds,
    occurredAt: new Date().toISOString()
  };

  sendTelemetryPayload(payload);
}

/**
 * Tracks observable high-intent visitor threshold events.
 */
export function trackHighIntent(intentReason: string): void {
  if (typeof window === "undefined") return;

  const session = getOrCreateSession();
  const now = Date.now();
  const durationSeconds = Math.max(0, Math.round((now - session.sessionStartTime) / 1000));

  const payload = {
    sessionId: session.sessionId,
    visitorId: session.visitorId,
    isReturning: session.isReturning,
    sessionNumber: session.sessionNumber,
    eventType: "HIGH_INTENT",
    path: window.location.pathname,
    intentReason,
    actionDetails: intentReason,
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigationPath: session.navigationPath,
    pagesCount: session.navigationPath.length,
    durationSeconds,
    occurredAt: new Date().toISOString()
  };

  sendTelemetryPayload(payload);
}

/**
 * Tracks an internal site search event.
 */
export function trackSiteSearch(query: string, resultsCount?: number, selectedResult?: string): void {
  if (typeof window === "undefined" || !query || query.trim().length < 2) return;

  const session = getOrCreateSession();
  const q = query.trim();

  if (!session.searchesPerformed.includes(q)) {
    session.searchesPerformed.push(q);
    safeSetStorage(sessionStorage, STORAGE_KEYS.SEARCHES, JSON.stringify(session.searchesPerformed));
  }

  const now = Date.now();
  const durationSeconds = Math.max(0, Math.round((now - session.sessionStartTime) / 1000));

  const payload = {
    sessionId: session.sessionId,
    visitorId: session.visitorId,
    isReturning: session.isReturning,
    sessionNumber: session.sessionNumber,
    eventType: "SEARCH",
    path: typeof window !== "undefined" ? window.location.pathname : "/search",
    searchQuery: q,
    searchResultsCount: resultsCount,
    searchSelectedResult: selectedResult,
    viewport: typeof window !== "undefined" ? `${window.innerWidth} × ${window.innerHeight}` : undefined,
    language: typeof navigator !== "undefined" ? navigator.language : undefined,
    timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined,
    navigationPath: session.navigationPath,
    entitiesViewed: session.entitiesViewed,
    searchesPerformed: session.searchesPerformed,
    actionsPerformed: session.actionsPerformed,
    pagesCount: session.navigationPath.length,
    durationSeconds,
    occurredAt: new Date().toISOString()
  };

  sendTelemetryPayload(payload);
}

/**
 * Tracks high-value user activities (Form submissions, research requests, consultation clicks, claim actions).
 */
export function trackHighValueActivity(
  actionName: string,
  actionDetails?: string,
  leadData?: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    message?: string;
    requestType?: string;
  }
): void {
  if (typeof window === "undefined") return;

  const session = getOrCreateSession();
  const actKey = actionDetails ? `${actionName} (${actionDetails})` : actionName;

  if (!session.actionsPerformed.includes(actKey)) {
    session.actionsPerformed.push(actKey);
    safeSetStorage(sessionStorage, STORAGE_KEYS.ACTIONS, JSON.stringify(session.actionsPerformed));
  }

  const now = Date.now();
  const durationSeconds = Math.max(0, Math.round((now - session.sessionStartTime) / 1000));
  const entity = extractEntityFromPath(window.location.pathname);

  const payload = {
    sessionId: session.sessionId,
    visitorId: session.visitorId,
    isReturning: session.isReturning,
    sessionNumber: session.sessionNumber,
    eventType: "HIGH_VALUE",
    path: window.location.pathname,
    actionName,
    actionDetails,
    leadData,
    entityType: entity.entityType,
    entityName: entity.entityName || leadData?.company,
    entitySlug: entity.entitySlug,
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigationPath: session.navigationPath,
    entitiesViewed: session.entitiesViewed,
    searchesPerformed: session.searchesPerformed,
    actionsPerformed: session.actionsPerformed,
    pagesCount: session.navigationPath.length,
    durationSeconds,
    occurredAt: new Date().toISOString()
  };

  sendTelemetryPayload(payload);
}

/**
 * Flushes session summary when visitor leaves or session becomes inactive.
 */
export function flushSessionSummary(): void {
  if (typeof window === "undefined") return;

  const session = getOrCreateSession();
  const now = Date.now();
  const durationSeconds = Math.max(0, Math.round((now - session.sessionStartTime) / 1000));

  const payload = {
    sessionId: session.sessionId,
    visitorId: session.visitorId,
    isReturning: session.isReturning,
    sessionNumber: session.sessionNumber,
    eventType: "SESSION_SUMMARY",
    path: window.location.pathname,
    durationSeconds,
    pagesCount: session.navigationPath.length,
    navigationPath: session.navigationPath,
    entitiesViewed: session.entitiesViewed,
    searchesPerformed: session.searchesPerformed,
    actionsPerformed: session.actionsPerformed,
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    occurredAt: new Date().toISOString()
  };

  sendTelemetryPayload(payload);
}
