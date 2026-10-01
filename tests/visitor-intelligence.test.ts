import test from "node:test";
import assert from "node:assert/strict";
import { parseUserAgent, parseSourceAttribution, parseVercelGeoHeaders } from "../lib/visitor-parser";
import {
  escapeHtml,
  maskId,
  formatDuration,
  formatNewVisitorMessage,
  formatPageViewMessage,
  formatServiceInterestMessage,
  formatProjectCompanyInterestMessage,
  formatHighIntentVisitorMessage,
  formatFormStartedMessage,
  formatFormAbandonedMessage,
  formatLeadTelegramMessage,
  VisitorEventData,
  LeadTelegramData
} from "../lib/telegram-visitor-formatter";
import { processVisitorEvent } from "../lib/visitor-intelligence";

test("Visitor Parser — User Agent Classification", () => {
  const macSafari = parseUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15");
  assert.equal(macSafari.deviceCategory, "Desktop");
  assert.equal(macSafari.operatingSystem, "macOS");
  assert.equal(macSafari.browser, "Safari");
  assert.equal(macSafari.isBot, false);

  const iPhone = parseUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1");
  assert.equal(iPhone.deviceCategory, "Mobile");
  assert.equal(iPhone.operatingSystem, "iOS");
  assert.equal(iPhone.browser, "Safari");

  const googlebot = parseUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");
  assert.equal(googlebot.isBot, true);
  assert.equal(googlebot.botName, "Googlebot");
});

test("Visitor Parser — Source & Geo Resolution", () => {
  const source = parseSourceAttribution("https://www.google.com/search?q=constructii", {});
  assert.equal(source.channel, "GOOGLE");
  assert.equal(source.sourceName, "Google");

  const headers = new Headers({
    "x-vercel-ip-country": "RO",
    "x-vercel-ip-country-region": "B",
    "x-vercel-ip-city": "Bucharest",
    "x-vercel-ip-timezone": "Europe/Bucharest"
  });
  const geo = parseVercelGeoHeaders(headers);
  assert.equal(geo.city, "Bucharest");
  assert.equal(geo.country, "Romania");
  assert.equal(geo.displayLocation, "Bucharest, B, Romania");
});

test("Telegram Formatter — HTML Escaping & Masking", () => {
  assert.equal(escapeHtml("<script>alert(1)</script>"), "&lt;script&gt;alert(1)&lt;/script&gt;");
  assert.equal(escapeHtml("A & B < C > D"), "A &amp; B &lt; C &gt; D");
  assert.equal(maskId("VIS-8F31A299999"), "VIS-8F31A2");
  assert.equal(formatDuration(402), "06:42");
});

test("Telegram Formatter — Visitor Intelligence Events", () => {
  const eventData: VisitorEventData = {
    sessionId: "VIS-8F31A2",
    visitorId: "VIS-8F31A2",
    path: "/services/calitate-constructii",
    previousPath: "/",
    pageTitle: "Servicii de calitate în construcții",
    serviceName: "Servicii de calitate în construcții",
    userAgent: { deviceCategory: "Desktop", operatingSystem: "macOS", browser: "Safari", isBot: false },
    source: { sourceName: "Google", displaySummary: "Google", channel: "ORGANIC_SEARCH" },
    location: { displayLocation: "Bucharest, Romania", timezone: "Europe/Bucharest" },
    durationSeconds: 402,
    intentReason: "4 service pages"
  };

  // 1. NEW VISITOR
  const newVisMsg = formatNewVisitorMessage(eventData);
  assert.ok(newVisMsg.includes("🟢 <b>NEW VISITOR</b>"));
  assert.ok(newVisMsg.includes("CONSTRUCTIONS by AiXLuxury"));
  assert.ok(newVisMsg.includes("Bucharest, Romania"));

  // 2. VISITOR PAGE VIEW
  const pageMsg = formatPageViewMessage(eventData);
  assert.ok(pageMsg.includes("👁 <b>VISITOR</b>"));
  assert.ok(pageMsg.includes("Servicii de calitate în construcții"));

  // 3. SERVICE INTEREST
  const srvMsg = formatServiceInterestMessage(eventData);
  assert.ok(srvMsg.includes("🔥 <b>SERVICE INTEREST</b>"));
  assert.ok(srvMsg.includes("Visitor opened:"));

  // 4. PROJECT / COMPANY INTEREST
  const projMsg = formatProjectCompanyInterestMessage({
    ...eventData,
    path: "/projects/one-floreasca-city",
    entityName: "One Floreasca City",
    entityType: "PROJECT"
  });
  assert.ok(projMsg.includes("🏗 <b>PROJECT / COMPANY INTEREST</b>"));
  assert.ok(projMsg.includes("One Floreasca City"));

  // 5. HIGH INTENT VISITOR
  const highIntentMsg = formatHighIntentVisitorMessage(eventData);
  assert.ok(highIntentMsg.includes("🔥 <b>HIGH INTENT VISITOR</b>"));
  assert.ok(highIntentMsg.includes("4 service pages"));
  assert.ok(highIntentMsg.includes("06:42"));

  // 6. FORM STARTED
  const formStartMsg = formatFormStartedMessage({
    ...eventData,
    actionDetails: "General contact"
  });
  assert.ok(formStartMsg.includes("📝 <b>CONTACT FORM STARTED</b>"));
  assert.ok(formStartMsg.includes("General contact"));

  // 7. FORM ABANDONED (Strictly field names only, zero PII)
  const formAbMsg = formatFormAbandonedMessage({
    ...eventData,
    actionDetails: "Name, Phone, Interest"
  });
  assert.ok(formAbMsg.includes("⚠️ <b>CONTACT FORM ABANDONED</b>"));
  assert.ok(formAbMsg.includes("Name, Phone, Interest"));
});

test("Telegram Formatter — Lead Notification Specializations", () => {
  // 1. General Lead Format
  const genLead: LeadTelegramData = {
    leadId: "LEAD-8A7B9C1D",
    fullName: "Cristian Example",
    phone: "0767123456",
    email: "example@email.com",
    companyName: "Example Construction",
    companyRole: "Administrator",
    serviceInterest: "Manager calitate",
    urgency: "Urgent",
    preferredContact: "Telefon",
    message: "Avem nevoie de un manager de calitate pentru un proiect în București.",
    projectName: "Example Residence",
    projectType: "Rezidențial",
    projectStage: "Execuție",
    projectLocation: "București",
    visitorId: "VIS-8F31A2",
    landingPath: "/services/manager-calitate",
    previousPath: "/services",
    source: "Google",
    deviceCategory: "Desktop",
    browser: "Safari",
    sessionDuration: "08:42"
  };

  const genMsg = formatLeadTelegramMessage(genLead);
  assert.ok(genMsg.includes("🚨 <b>NEW LEAD — CONSTRUCTIONS</b>"));
  assert.ok(genMsg.includes("Cristian Example"));
  assert.ok(genMsg.includes("Manager calitate"));
  assert.ok(genMsg.includes("Example Residence"));
  assert.ok(genMsg.includes("LEAD-8A7B9C1D"));

  // 2. Real Estate Lead Format
  const reLead: LeadTelegramData = {
    leadId: "LEAD-RE9988",
    fullName: "Elena Popa",
    phone: "0722000111",
    email: "elena@realestate.ro",
    serviceInterest: "Vânzări real estate",
    projectName: "Complex Floreasca",
    propertyLocation: "Sector 1, București",
    projectType: "Apartamente Premium",
    message: "Doresc consultanță vânzări pentru 40 apartamente.",
    visitorId: "VIS-RE1234",
    landingPath: "/services/vanzari-real-estate",
    source: "Direct"
  };

  const reMsg = formatLeadTelegramMessage(reLead);
  assert.ok(reMsg.includes("🏠 <b>NEW REAL ESTATE LEAD</b>"));
  assert.ok(reMsg.includes("Elena Popa"));
  assert.ok(reMsg.includes("Complex Floreasca"));

  // 3. Credit Lead Format
  const creditLead: LeadTelegramData = {
    leadId: "LEAD-CR7766",
    fullName: "Mihai Ionescu",
    phone: "0744111222",
    email: "mihai@invest.ro",
    companyName: "Invest Development SRL",
    serviceInterest: "Credite / finanțare",
    financingInterest: "Credit dezvoltare proiect rezidențial 2.5M EUR",
    projectName: "Parc Residence",
    projectLocation: "Cluj-Napoca",
    urgency: "Urgent",
    visitorId: "VIS-CR5544"
  };

  const crMsg = formatLeadTelegramMessage(creditLead);
  assert.ok(crMsg.includes("💰 <b>NEW CREDIT LEAD</b>"));
  assert.ok(crMsg.includes("Mihai Ionescu"));
  assert.ok(crMsg.includes("Credit dezvoltare proiect rezidențial 2.5M EUR"));

  // 4. Insurance Lead Format
  const insLead: LeadTelegramData = {
    leadId: "LEAD-IN3322",
    fullName: "Radu Stan",
    phone: "0755333444",
    email: "radu@construct-group.ro",
    companyName: "Construct Group SRL",
    serviceInterest: "Intermediere asigurări",
    insuranceInterest: "Poliță CAR (All Risks) + Garanție de bună execuție",
    message: "Valoare lucrare: 5.000.000 EUR",
    visitorId: "VIS-IN9988"
  };

  const insMsg = formatLeadTelegramMessage(insLead);
  assert.ok(insMsg.includes("🛡 <b>NEW INSURANCE LEAD</b>"));
  assert.ok(insMsg.includes("Radu Stan"));
  assert.ok(insMsg.includes("Poliță CAR"));
});

test("Visitor Intelligence — Bot Handling", async () => {
  const res = await processVisitorEvent(
    { sessionId: "bot-session-1", visitorId: "bot-vid-1", eventType: "NEW_VISITOR", path: "/" },
    new Headers({ "user-agent": "Googlebot/2.1" })
  );
  assert.equal(res.success, true);
  assert.equal(res.telegramSent, false);
});
