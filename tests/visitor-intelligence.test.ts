import test from "node:test";
import assert from "node:assert/strict";
import { parseUserAgent, parseAcquisitionSource, classifyPageType, extractLocationFromHeaders } from "../lib/visitor-parser";
import { escapeHtml, formatTimestamp, formatDuration, formatNewVisitorMessage, formatReturningVisitorMessage, formatEntityViewMessage, formatSiteSearchMessage, formatHighValueActivityMessage, formatSessionSummaryMessage } from "../lib/telegram-visitor-formatter";
import { processVisitorIntelligenceEvent } from "../lib/visitor-intelligence";

test("Visitor Parser — User Agent Classification", () => {
  const macSafari = parseUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15");
  assert.equal(macSafari.deviceCategory, "Desktop");
  assert.equal(macSafari.operatingSystem, "macOS");
  assert.equal(macSafari.browser, "Safari");
  assert.equal(macSafari.isBot, false);

  const winChrome = parseUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36");
  assert.equal(winChrome.deviceCategory, "Desktop");
  assert.equal(winChrome.operatingSystem, "Windows 10/11");
  assert.equal(winChrome.browser, "Chrome");
  assert.equal(winChrome.isBot, false);

  const iPhone = parseUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1");
  assert.equal(iPhone.deviceCategory, "Mobile");
  assert.equal(iPhone.operatingSystem, "iOS");
  assert.equal(iPhone.browser, "Safari");

  const iPad = parseUserAgent("Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1");
  assert.equal(iPad.deviceCategory, "Tablet");
  assert.equal(iPad.operatingSystem, "iPadOS");

  const googlebot = parseUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");
  assert.equal(googlebot.isBot, true);
  assert.equal(googlebot.botName, "Googlebot");
});

test("Visitor Parser — Acquisition Source & UTM Resolution", () => {
  const direct = parseAcquisitionSource(null, {});
  assert.equal(direct.channel, "DIRECT");
  assert.equal(direct.displaySummary, "Direct / Unknown");

  const googleRef = parseAcquisitionSource("https://www.google.com/search?q=constructii", {});
  assert.equal(googleRef.channel, "GOOGLE");
  assert.equal(googleRef.displaySummary, "Google • Organic");

  const googlePaid = parseAcquisitionSource("https://www.google.com", { utm_source: "google", utm_medium: "cpc", utm_campaign: "q4-expansion" });
  assert.equal(googlePaid.channel, "CAMPAIGN");
  assert.equal(googlePaid.sourceName, "Google");

  const linkedIn = parseAcquisitionSource("https://www.linkedin.com/feed/", {});
  assert.equal(linkedIn.channel, "SOCIAL");
  assert.equal(linkedIn.sourceName, "LinkedIn");
});

test("Visitor Parser — Route Taxonomy", () => {
  assert.equal(classifyPageType("/"), "HOME");
  assert.equal(classifyPageType("/companies/strabag"), "COMPANY");
  assert.equal(classifyPageType("/projects/a7-highway"), "PROJECT");
  assert.equal(classifyPageType("/cities/bucharest"), "CITY");
  assert.equal(classifyPageType("/search"), "SEARCH");
  assert.equal(classifyPageType("/compare"), "COMPARE");
  assert.equal(classifyPageType("/watchlist"), "WATCHLIST");
  assert.equal(classifyPageType("/research-request"), "CONTACT");
  assert.equal(classifyPageType("/work-with-us"), "WORK_WITH_US");
});

test("Visitor Parser — Vercel Geo Header Extraction", () => {
  const headers = new Headers({
    "x-vercel-ip-country": "RO",
    "x-vercel-ip-country-region": "B",
    "x-vercel-ip-city": "Bucharest",
    "x-vercel-ip-timezone": "Europe/Bucharest"
  });
  const geo = extractLocationFromHeaders(headers);
  assert.equal(geo.isAvailable, true);
  assert.equal(geo.city, "Bucharest");
  assert.equal(geo.country, "Romania");
  assert.equal(geo.timezone, "Europe/Bucharest");

  const emptyGeo = extractLocationFromHeaders(new Headers());
  assert.equal(emptyGeo.isAvailable, false);
  assert.equal(emptyGeo.displayLocation, "Location: unavailable");
});

test("Telegram Formatter — HTML Escaping & Formatting", () => {
  assert.equal(escapeHtml("<script>alert(1)</script>"), "&lt;script&gt;alert(1)&lt;/script&gt;");
  assert.equal(escapeHtml("Tom & Jerry"), "Tom &amp; Jerry");
  assert.equal(formatDuration(125), "02m 05s");
});

test("Telegram Formatter — Full Message Generation", () => {
  const data = {
    sessionId: "8f3c12345678",
    visitorId: "v-11223344",
    path: "/companies/strabag",
    entityType: "COMPANY",
    entityName: "Strabag Romania",
    entitySlug: "strabag-romania",
    userAgent: { deviceCategory: "Desktop" as const, operatingSystem: "macOS", browser: "Safari", isBot: false },
    source: { channel: "GOOGLE" as const, sourceName: "Google", displaySummary: "Google • Organic", referrerDomain: "google.com" },
    location: { country: "Romania", city: "Bucharest", timezone: "Europe/Bucharest", displayLocation: "Bucharest, Romania", isAvailable: true }
  };

  const newMsg = formatNewVisitorMessage(data);
  assert.match(newMsg, /CONSTRUCTIONS by AiXLuxury/);
  assert.match(newMsg, /🟢 <b>NEW VISITOR<\/b>/);
  assert.match(newMsg, /Bucharest, Romania/);
  assert.match(newMsg, /8f3c12••••/);

  const retMsg = formatReturningVisitorMessage({ ...data, isReturning: true, sessionNumber: 2 });
  assert.match(retMsg, /↩️ <b>RETURNING VISITOR<\/b>/);
  assert.match(retMsg, /Session #2/);

  const entMsg = formatEntityViewMessage(data);
  assert.match(entMsg, /🏢 <b>COMPANY DOSSIER INSPECTION<\/b>/);
  assert.match(entMsg, /Strabag Romania/);

  const searchMsg = formatSiteSearchMessage({ ...data, searchQuery: "Pipera", searchResultsCount: 18 });
  assert.match(searchMsg, /🔎 <b>SITE SEARCH<\/b>/);
  assert.match(searchMsg, /Pipera/);
  assert.match(searchMsg, /18/);

  const hvMsg = formatHighValueActivityMessage({ ...data, actionName: "Research Request Submitted", leadData: { name: "Alex M", email: "alex@invest.ro" } });
  assert.match(hvMsg, /🔥 <b>HIGH-VALUE ACTIVITY<\/b>/);
  assert.match(hvMsg, /Alex M/);

  const sumMsg = formatSessionSummaryMessage({ ...data, durationSeconds: 784, navigationPath: ["/", "/companies", "/companies/strabag"] });
  assert.match(sumMsg, /📊 <b>SESSION SUMMARY<\/b>/);
  assert.match(sumMsg, /13m 04s/);
});

test("Visitor Intelligence — Bot Filtering", async () => {
  const res = await processVisitorIntelligenceEvent(
    { sessionId: "bot-1", visitorId: "bot-1", eventType: "NEW_VISITOR", path: "/" },
    new Headers({ "user-agent": "Googlebot/2.1" }),
    "66.249.66.1"
  );
  assert.equal(res.success, true);
  assert.equal(res.telegramSent, false);
});