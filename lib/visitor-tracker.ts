/**
 * Client-Side Visitor Intelligence Tracker
 * CONSTRUCTIONS by AiXLuxury
 *
 * Lightweight, non-intrusive client telemetry engine with automatic session management,
 * entity detection, search tracking, CTA instrumentation, and reliable beacon flush.
 */

const STORAGE_KEYS = {
  VISITOR_ID: "cv_vid",
  VISIT_COUNT: "cv_vcount",
  FIRST_SEEN: "cv_fseen",
  SESSION_ID: "cv_sid",
  SESSION_START: "cv_sstart",
  LAST_ACTIVE: "cv_lactive",
  NAV_PATH: "cv_npath",
  ENTITIES: "cv_ent",
  SEARCHES: "cv_srch",
  ACTIONS: "cv_act"
};

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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
    // Ignore storage quota/security errors
  }
}

export interface ClientSessionState {
  visitorId: string;
  sessionId: string;
  isReturning: boolean;
  sessionNumber: number;
  sessionStartTime: number;
  navigationPath: string[];
  entitiesViewed: string[];
  searchesPerformed: string[];
  actionsPerformed: string[];
}

let cachedSession: ClientSessionState | null = null;
let lastPageStartTime = Date.now();
let lastPath = "";

export function getOrCreateSession(): ClientSessionState {
  if (typeof window === "undefined") {
    return {
      visitorId: "server",
      sessionId: "server",
      isReturning: false,
      sessionNumber: 1,
      sessionStartTime: Date.now(),
      navigationPath: [],
      entitiesViewed: [],
      searchesPerformed: [],
      actionsPerformed: []
    };
  }

  if (cachedSession) {
    return cachedSession!;
  }

  const now = Date.now();

  // 1. Visitor identification
  let visitorId = safeGetStorage(localStorage, STORAGE_KEYS.VISITOR_ID);
  let visitCount = parseInt(safeGetStorage(localStorage, STORAGE_KEYS.VISIT_COUNT) || "0", 10);
  let isReturning = false;

  if (!visitorId) {
    visitorId = generateUUID();
    safeSetStorage(localStorage, STORAGE_KEYS.VISITOR_ID, visitorId);
    safeSetStorage(localStorage, STORAGE_KEYS.FIRST_SEEN, new Date().toISOString());
    visitCount = 1;
    safeSetStorage(localStorage, STORAGE_KEYS.VISIT_COUNT, "1");
  } else {
    isReturning = true;
  }

  // 2. Session identification
  let sessionId = safeGetStorage(sessionStorage, STORAGE_KEYS.SESSION_ID) || generateUUID();
  const lastActive = parseInt(safeGetStorage(sessionStorage, STORAGE_KEYS.LAST_ACTIVE) || "0", 10);
  let sessionStartTime = parseInt(safeGetStorage(sessionStorage, STORAGE_KEYS.SESSION_START) || "0", 10);

  const isSessionExpired = !sessionId || now - lastActive > SESSION_TIMEOUT_MS;

  if (isSessionExpired) {
    sessionId = generateUUID();
    sessionStartTime = now;
    visitCount += 1;
    safeSetStorage(localStorage, STORAGE_KEYS.VISIT_COUNT, String(visitCount));
    safeSetStorage(sessionStorage, STORAGE_KEYS.SESSION_ID, sessionId);
    safeSetStorage(sessionStorage, STORAGE_KEYS.SESSION_START, String(sessionStartTime));
    safeSetStorage(sessionStorage, STORAGE_KEYS.NAV_PATH, JSON.stringify([]));
    safeSetStorage(sessionStorage, STORAGE_KEYS.ENTITIES, JSON.stringify([]));
    safeSetStorage(sessionStorage, STORAGE_KEYS.SEARCHES, JSON.stringify([]));
    safeSetStorage(sessionStorage, STORAGE_KEYS.ACTIONS, JSON.stringify([]));
  }

  safeSetStorage(sessionStorage, STORAGE_KEYS.LAST_ACTIVE, String(now));

  let navPath: string[] = [];
  let entities: string[] = [];
  let searches: string[] = [];
  let actions: string[] = [];

  try {
    navPath = JSON.parse(safeGetStorage(sessionStorage, STORAGE_KEYS.NAV_PATH) || "[]");
    entities = JSON.parse(safeGetStorage(sessionStorage, STORAGE_KEYS.ENTITIES) || "[]");
    searches = JSON.parse(safeGetStorage(sessionStorage, STORAGE_KEYS.SEARCHES) || "[]");
    actions = JSON.parse(safeGetStorage(sessionStorage, STORAGE_KEYS.ACTIONS) || "[]");
  } catch {
    // Reset if corrupted
  }

  cachedSession = {
    visitorId,
    sessionId,
    isReturning,
    sessionNumber: visitCount,
    sessionStartTime,
    navigationPath: navPath,
    entitiesViewed: entities,
    searchesPerformed: searches,
    actionsPerformed: actions
  };

  return cachedSession;
}

function sendTelemetryPayload(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  const jsonStr = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([jsonStr], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/telemetry/events", blob);
      if (sent) return;
    } catch {
      // Fallback to fetch
    }
  }

  try {
    fetch("/api/telemetry/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonStr,
      keepalive: true
    }).catch(() => {});
  } catch {
    // Non-blocking
  }
}

/**
 * Extracts entity info from the pathname.
 */
export function extractEntityFromPath(pathname: string): {
  entityType?: "COMPANY" | "PROJECT" | "CITY";
  entitySlug?: string;
  entityName?: string;
} {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length >= 2) {
    const section = parts[0].toLowerCase();
    const slug = parts[1];

    if (
      section === "companies" ||
      section === "developers" ||
      section === "contractors" ||
      section === "architects" ||
      section === "engineers" ||
      section === "agencies"
    ) {
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
  lastPageStartTime = now;
  lastPath = pathname;

  // Update navigation path
  if (!session.navigationPath.includes(pathname)) {
    session.navigationPath.push(pathname);
    safeSetStorage(sessionStorage, STORAGE_KEYS.NAV_PATH, JSON.stringify(session.navigationPath));
  }

  // Check for entity
  const entity = extractEntityFromPath(pathname);
  if (entity.entityName && !session.entitiesViewed.includes(entity.entityName)) {
    session.entitiesViewed.push(entity.entityName);
    safeSetStorage(sessionStorage, STORAGE_KEYS.ENTITIES, JSON.stringify(session.entitiesViewed));
  }

  const durationSeconds = Math.max(0, Math.round((now - session.sessionStartTime) / 1000));
  const isFirstPage = session.navigationPath.length <= 1;

  let eventType = "PAGE_VIEW";
  if (isFirstPage) {
    eventType = session.isReturning ? "RETURNING_VISITOR" : "NEW_VISITOR";
  } else if (entity.entityType) {
    eventType = "ENTITY_VIEW";
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
    pageTitle: typeof document !== "undefined" ? document.title : "",
    entityType: entity.entityType,
    entityName: entity.entityName,
    entitySlug: entity.entitySlug,
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
