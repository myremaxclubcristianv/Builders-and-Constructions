/**
 * Visitor Intelligence Parser Utilities
 * CONSTRUCTIONS by AiXLuxury
 *
 * Privacy-first heuristics for user-agent, traffic source, page classification, and geolocation extraction.
 */

export interface ParsedUserAgent {
  deviceCategory: "Desktop" | "Mobile" | "Tablet";
  operatingSystem: string;
  browser: string;
  browserVersion?: string;
  isBot: boolean;
  botName?: string;
}

export interface ParsedSource {
  channel: "DIRECT" | "GOOGLE" | "BING" | "SOCIAL" | "REFERRAL" | "CAMPAIGN" | "ORGANIC" | "OTHER";
  sourceName: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrerDomain?: string;
  rawReferrer?: string;
  displaySummary: string;
}

export interface ParsedLocation {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  timezone?: string;
  displayLocation: string;
  isAvailable: boolean;
}

const COUNTRY_CODE_MAP: Record<string, string> = {
  RO: "Romania",
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  AE: "United Arab Emirates",
  MD: "Moldova",
  HU: "Hungary",
  BG: "Bulgaria",
  PL: "Poland",
  CA: "Canada",
  AU: "Australia",
  IL: "Israel",
  TR: "Turkey",
  GR: "Greece"
};

/**
 * Parses user agent string to extract clean device category, OS, browser, and bot status.
 */
export function parseUserAgent(uaString?: string | null): ParsedUserAgent {
  if (!uaString || typeof uaString !== "string" || uaString.trim() === "") {
    return {
      deviceCategory: "Desktop",
      operatingSystem: "Unknown",
      browser: "Unknown",
      isBot: false
    };
  }

  const ua = uaString.toLowerCase();

  // 1. Bot detection
  const botPatterns: { pattern: RegExp; name: string }[] = [
    { pattern: /googlebot/i, name: "Googlebot" },
    { pattern: /bingbot/i, name: "Bingbot" },
    { pattern: /slurp/i, name: "Yahoo Slurp" },
    { pattern: /duckduckbot/i, name: "DuckDuckBot" },
    { pattern: /baiduspider/i, name: "Baiduspider" },
    { pattern: /yandexbot/i, name: "YandexBot" },
    { pattern: /sogou/i, name: "Sogou" },
    { pattern: /exabot/i, name: "Exabot" },
    { pattern: /facebookexternalhit/i, name: "FacebookBot" },
    { pattern: /linkedinbot/i, name: "LinkedInBot" },
    { pattern: /twitterbot/i, name: "TwitterBot" },
    { pattern: /telegrambot/i, name: "TelegramBot" },
    { pattern: /whatsapp/i, name: "WhatsAppBot" },
    { pattern: /slackbot/i, name: "Slackbot" },
    { pattern: /discordbot/i, name: "DiscordBot" },
    { pattern: /applebot/i, name: "Applebot" },
    { pattern: /semrushbot/i, name: "SemrushBot" },
    { pattern: /ahrefsbot/i, name: "AhrefsBot" },
    { pattern: /dotbot/i, name: "DotBot" },
    { pattern: /mj12bot/i, name: "MJ12bot" }
  ];

  for (const b of botPatterns) {
    if (b.pattern.test(ua)) {
      return {
        deviceCategory: "Desktop",
        operatingSystem: "Bot",
        browser: b.name,
        isBot: true,
        botName: b.name
      };
    }
  }

  // 2. Device Category
  let deviceCategory: "Desktop" | "Mobile" | "Tablet" = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceCategory = "Tablet";
  } else if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop|android/i.test(ua)) {
    deviceCategory = "Mobile";
  }

  // 3. Operating System
  let operatingSystem = "Unknown";
  if (/macintosh|mac os x/i.test(ua) && !/iphone|ipad|ipod/i.test(ua)) {
    operatingSystem = "macOS";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    operatingSystem = /ipad/i.test(ua) ? "iPadOS" : "iOS";
  } else if (/windows nt 10/i.test(ua)) {
    operatingSystem = "Windows 10/11";
  } else if (/windows/i.test(ua)) {
    operatingSystem = "Windows";
  } else if (/android/i.test(ua)) {
    operatingSystem = "Android";
  } else if (/cros/i.test(ua)) {
    operatingSystem = "Chrome OS";
  } else if (/linux/i.test(ua)) {
    operatingSystem = "Linux";
  }

  // 4. Browser & Version
  let browser = "Unknown";
  let browserVersion: string | undefined;

  const versionMatch = (regex: RegExp) => {
    const match = uaString.match(regex);
    return match ? match[1] : undefined;
  };

  if (/edg\/([0-9.]+)/i.test(uaString)) {
    browser = "Microsoft Edge";
    browserVersion = versionMatch(/edg\/([0-9.]+)/i);
  } else if (/opr\/([0-9.]+)|opera/i.test(uaString)) {
    browser = "Opera";
    browserVersion = versionMatch(/opr\/([0-9.]+)/i);
  } else if (/samsungbrowser\/([0-9.]+)/i.test(uaString)) {
    browser = "Samsung Internet";
    browserVersion = versionMatch(/samsungbrowser\/([0-9.]+)/i);
  } else if (/chrome\/([0-9.]+)/i.test(uaString) && !/chromium/i.test(uaString)) {
    browser = "Chrome";
    browserVersion = versionMatch(/chrome\/([0-9.]+)/i);
  } else if (/version\/([0-9.]+).*safari/i.test(uaString) || /safari/i.test(uaString)) {
    browser = "Safari";
    browserVersion = versionMatch(/version\/([0-9.]+)/i);
  } else if (/firefox\/([0-9.]+)/i.test(uaString)) {
    browser = "Firefox";
    browserVersion = versionMatch(/firefox\/([0-9.]+)/i);
  }

  return {
    deviceCategory,
    operatingSystem,
    browser,
    browserVersion,
    isBot: false
  };
}

/**
 * Parses acquisition source, UTM parameters, and referrer to determine acquisition channel.
 */
export function parseAcquisitionSource(
  referrerUrl?: string | null,
  searchParams?: Record<string, string> | URLSearchParams
): ParsedSource {
  const params: Record<string, string> = {};
  if (searchParams) {
    if (typeof (searchParams as URLSearchParams).forEach === "function") {
      (searchParams as URLSearchParams).forEach((value, key) => {
        params[key.toLowerCase()] = value;
      });
    } else {
      Object.entries(searchParams).forEach(([k, v]) => {
        params[k.toLowerCase()] = String(v);
      });
    }
  }

  const utmSource = params["utm_source"]?.trim();
  const utmMedium = params["utm_medium"]?.trim();
  const utmCampaign = params["utm_campaign"]?.trim();
  const utmTerm = params["utm_term"]?.trim();
  const utmContent = params["utm_content"]?.trim();

  let referrerDomain: string | undefined;
  let cleanReferrer: string | undefined;

  if (referrerUrl && typeof referrerUrl === "string" && referrerUrl.trim() !== "") {
    try {
      const url = new URL(referrerUrl);
      referrerDomain = url.hostname.toLowerCase();
      cleanReferrer = referrerUrl;
    } catch {
      referrerDomain = referrerUrl.split("/")[0].toLowerCase();
      cleanReferrer = referrerUrl;
    }
  }

  // Filter out self-referrals
  if (
    referrerDomain &&
    (referrerDomain.includes("constructions.cristianvaduva.com") ||
      referrerDomain.includes("localhost") ||
      referrerDomain.includes("127.0.0.1") ||
      referrerDomain.includes("builders-and-constructions"))
  ) {
    referrerDomain = undefined;
    cleanReferrer = undefined;
  }

  // Determine Channel & Source Name
  let channel: ParsedSource["channel"] = "DIRECT";
  let sourceName = "Direct / Unknown";
  let displaySummary = "Direct / Unknown";

  const isCampaign = Boolean(
    utmMedium && /^(cpc|ppc|paid|campaign|ad|ads|sponsored)$/i.test(utmMedium)
  );

  if (utmSource) {
    const s = utmSource.toLowerCase();
    if (s.includes("google")) {
      channel = isCampaign ? "CAMPAIGN" : "GOOGLE";
      sourceName = "Google";
    } else if (s.includes("bing")) {
      channel = isCampaign ? "CAMPAIGN" : "BING";
      sourceName = "Bing";
    } else if (s.includes("linkedin")) {
      channel = "SOCIAL";
      sourceName = "LinkedIn";
    } else if (s.includes("twitter") || s === "x" || s.includes("x.com")) {
      channel = "SOCIAL";
      sourceName = "X (Twitter)";
    } else if (s.includes("facebook") || s.includes("fb")) {
      channel = "SOCIAL";
      sourceName = "Facebook";
    } else if (s.includes("instagram")) {
      channel = "SOCIAL";
      sourceName = "Instagram";
    } else if (s.includes("telegram")) {
      channel = "SOCIAL";
      sourceName = "Telegram";
    } else if (s.includes("whatsapp")) {
      channel = "SOCIAL";
      sourceName = "WhatsApp";
    } else if (isCampaign) {
      channel = "CAMPAIGN";
      sourceName = utmSource;
    } else {
      channel = "OTHER";
      sourceName = utmSource;
    }
  } else if (referrerDomain) {
    const ref = referrerDomain.toLowerCase();
    if (ref.includes("google.")) {
      channel = "GOOGLE";
      sourceName = "Google";
    } else if (ref.includes("bing.")) {
      channel = "BING";
      sourceName = "Bing";
    } else if (ref.includes("linkedin.com") || ref.includes("lnkd.in")) {
      channel = "SOCIAL";
      sourceName = "LinkedIn";
    } else if (ref.includes("twitter.com") || ref.includes("t.co") || ref.includes("x.com")) {
      channel = "SOCIAL";
      sourceName = "X (Twitter)";
    } else if (ref.includes("facebook.com") || ref.includes("fb.com")) {
      channel = "SOCIAL";
      sourceName = "Facebook";
    } else if (ref.includes("instagram.com")) {
      channel = "SOCIAL";
      sourceName = "Instagram";
    } else if (ref.includes("t.me") || ref.includes("telegram.org")) {
      channel = "SOCIAL";
      sourceName = "Telegram";
    } else if (ref.includes("reddit.com")) {
      channel = "SOCIAL";
      sourceName = "Reddit";
    } else if (ref.includes("duckduckgo.com") || ref.includes("yahoo.com") || ref.includes("ecosia.org")) {
      channel = "ORGANIC";
      sourceName = referrerDomain;
    } else {
      channel = "REFERRAL";
      sourceName = referrerDomain;
    }
  }

  // Format display summary
  if (channel === "GOOGLE") {
    displaySummary = utmMedium ? `Google • ${utmMedium}` : "Google • Organic";
  } else if (channel === "BING") {
    displaySummary = "Bing • Organic";
  } else if (channel === "SOCIAL") {
    displaySummary = `${sourceName} • Social`;
  } else if (channel === "CAMPAIGN") {
    displaySummary = `${sourceName} • Campaign (${utmCampaign || utmMedium || "Paid"})`;
  } else if (channel === "REFERRAL") {
    displaySummary = `Referral • ${referrerDomain}`;
  } else if (channel === "ORGANIC") {
    displaySummary = `${sourceName} • Organic Search`;
  } else if (channel === "OTHER") {
    displaySummary = `${sourceName}`;
  } else {
    displaySummary = "Direct / Unknown";
  }

  return {
    channel,
    sourceName,
    medium: utmMedium,
    campaign: utmCampaign,
    term: utmTerm,
    content: utmContent,
    referrerDomain,
    rawReferrer: cleanReferrer,
    displaySummary
  };
}

/**
 * Classifies site routes into clean operational page types.
 */
export function classifyPageType(pathname: string): string {
  if (!pathname || pathname === "/") return "HOME";

  const p = pathname.toLowerCase();

  if (
    p.startsWith("/companies/") ||
    p.startsWith("/developers/") ||
    p.startsWith("/contractors/") ||
    p.startsWith("/architects/") ||
    p.startsWith("/engineers/") ||
    p.startsWith("/agencies/")
  ) {
    return "COMPANY";
  }

  if (p.startsWith("/projects/")) return "PROJECT";
  if (p.startsWith("/cities/")) return "CITY";

  if (
    p === "/companies" ||
    p === "/developers" ||
    p === "/contractors" ||
    p === "/architects" ||
    p === "/engineers" ||
    p === "/agencies"
  ) {
    return "COMPANY";
  }

  if (p === "/projects") return "PROJECT";
  if (p === "/cities") return "CITY";

  if (
    p === "/intelligence" ||
    p === "/signals" ||
    p === "/market" ||
    p === "/product-health" ||
    p === "/changes" ||
    p === "/video" ||
    p === "/activity" ||
    p === "/coverage" ||
    p === "/rankings" ||
    p === "/dealflow" ||
    p === "/priorities" ||
    p === "/pipeline" ||
    p === "/opportunities"
  ) {
    return "INTELLIGENCE";
  }

  if (p === "/search") return "SEARCH";
  if (p === "/compare") return "COMPARE";
  if (p === "/watchlist" || p === "/workspace") return "WATCHLIST";

  if (
    p === "/network" ||
    p === "/map" ||
    p === "/industry" ||
    p === "/decisions" ||
    p === "/commercial" ||
    p === "/actions" ||
    p === "/outreach" ||
    p === "/featured"
  ) {
    return "NETWORK";
  }

  if (
    p.startsWith("/about") ||
    p === "/methodology" ||
    p === "/terms" ||
    p === "/privacy" ||
    p === "/gdpr"
  ) {
    return "ABOUT";
  }

  if (
    p === "/research-request" ||
    p === "/report-error" ||
    p.startsWith("/promote") ||
    p === "/project-promotion"
  ) {
    return "CONTACT";
  }

  if (p === "/work-with-us") return "WORK_WITH_US";

  return "OTHER";
}

/**
 * Extracts approximate location from Vercel Edge/Serverless request headers.
 */
export function extractLocationFromHeaders(
  headers: Headers | Record<string, string | string[] | undefined>
): ParsedLocation {
  const getHeader = (key: string): string | undefined => {
    if (typeof (headers as Headers).get === "function") {
      const v = (headers as Headers).get(key);
      return v && v.trim() ? v.trim() : undefined;
    }
    const raw = (headers as Record<string, string | string[] | undefined>)[key.toLowerCase()];
    if (Array.isArray(raw)) return raw[0];
    return raw && raw.trim() ? raw.trim() : undefined;
  };

  const countryCode = getHeader("x-vercel-ip-country");
  const region = getHeader("x-vercel-ip-country-region");
  const cityRaw = getHeader("x-vercel-ip-city");
  const timezone = getHeader("x-vercel-ip-timezone");

  let city = cityRaw;
  if (city) {
    try {
      city = decodeURIComponent(city);
    } catch {
      // Keep raw
    }
  }

  const countryName = countryCode ? COUNTRY_CODE_MAP[countryCode.toUpperCase()] || countryCode : undefined;

  const parts: string[] = [];
  if (city) parts.push(city);
  if (region && region !== city) parts.push(region);
  if (countryName) parts.push(countryName);

  const isAvailable = parts.length > 0;
  const displayLocation = isAvailable ? parts.join(", ") : "Location: unavailable";

  return {
    country: countryName,
    countryCode,
    region,
    city,
    timezone,
    displayLocation,
    isAvailable
  };
}
