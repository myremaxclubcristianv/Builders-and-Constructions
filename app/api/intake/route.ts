import { NextRequest, NextResponse } from "next/server";
import { getServiceBySlug } from "@/lib/services-config";
import { getServiceClient } from "@/lib/supabase";
import { sendTelegramNotification } from "@/lib/telegram";
import { formatLeadTelegramMessage, LeadTelegramData } from "@/lib/telegram-visitor-formatter";
import { executeOperationalPipeline } from "@/lib/operational-pipeline";
import { checkRateLimit } from "@/lib/rate-limit";

function generateLeadId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "LEAD-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check (Defensive Security)
    const rateLimit = checkRateLimit(req, "intake_submission", {
      maxRequests: 10,
      windowMs: 60 * 1000
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Prea multe solicitări. Te rugăm să aștepți câteva momente." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Datele transmise sunt invalide." },
        { status: 400 }
      );
    }

    // 2. Honeypot check (anti-bot)
    if (body.company_tax_id_confirm || body.website_url_hp || body.honeypot) {
      return NextResponse.json({ ok: true, leadId: generateLeadId(), telegramDelivered: false }, { status: 200 });
    }

    // 3. Validation
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";

    if (!fullName || (!email && !phone)) {
      return NextResponse.json(
        { ok: false, error: "Numele și cel puțin un canal de contact (telefon sau email) sunt obligatorii." },
        { status: 400 }
      );
    }

    if (!body.consentGranted) {
      return NextResponse.json(
        { ok: false, error: "Este necesar acordul pentru prelucrarea datelor cu caracter personal." },
        { status: 400 }
      );
    }

    // Resolve service metadata
    const serviceDef = getServiceBySlug(body.serviceId);
    const serviceTitle = serviceDef ? serviceDef.title : (body.serviceName || "Serviciu General / Nespecificat");
    const serviceCategory = serviceDef ? serviceDef.categoryLabel : "General";

    const roleDisplay = body.role === "Alt rol" && body.customRole
      ? `${body.customRole} (Alt rol)`
      : (body.companyRole || body.role || "Nespecificat");

    const leadId = generateLeadId();
    const timestamp = new Date().toISOString();

    const locationParts = [
      body.projectCity,
      body.projectCounty,
      body.projectAddress,
      body.companyLocation
    ].filter(Boolean);
    const projectLocation = locationParts.length > 0 ? locationParts.join(", ") : undefined;

    const urgencyDisplay = body.urgency || "Normal";
    const source = body.source || "intake_form";
    const landingPath = body.landingPath || "/contact";
    const pageUrl = `https://constructions.cristianvaduva.com${landingPath}`;

    // 4. Supabase Lead Persistence (CRITICAL: Persist BEFORE Telegram)
    const client = getServiceClient();
    let dbRecordId: string | null = null;

    if (client) {
      try {
        const insertPayload: Record<string, any> = {
          name: fullName,
          company_name: body.companyName?.trim() || null,
          email: email || (phone ? `${phone.replace(/[^0-9]/g, "")}@phone.placeholder` : "contact@placeholder.local"),
          phone: phone || null,
          request_type: serviceTitle,
          message: [
            body.message ? `[Mesaj Client]: ${body.message}` : null,
            `[Rol]: ${roleDisplay}`,
            body.isCompany ? `[Companie CUI]: ${body.cui || "N/A"} | Domeniu: ${body.industryField || "N/A"}` : null,
            body.isProjectRelated === "yes" ? `[Proiect]: ${body.projectName || "N/A"} | Tip: ${body.projectType || "N/A"} | Stadiu: ${body.projectStage || "N/A"}` : null,
            `[Urgență]: ${urgencyDisplay}`,
            `[Canal Preferat]: ${body.preferredContact || "Orice"} (${body.preferredInterval || "Oricând"})`,
            `[Lead ID]: ${leadId}`
          ].filter(Boolean).join("\n"),
          source: source.length < 50 ? source : "homepage",
          lead_type: "company_inquiry",
          status: "new",
          landing_path: landingPath,
          referrer: body.referrer || null
        };

        const { data: leadRecord, error: leadErr } = await client
          .from("leads")
          .insert(insertPayload)
          .select("id")
          .maybeSingle();

        if (leadRecord?.id) {
          dbRecordId = leadRecord.id;

          if (body.serviceSpecificData && typeof body.serviceSpecificData === "object") {
            try {
              await client.from("lead_notes").insert({
                lead_id: dbRecordId,
                body: `[Intake Smart Data]:\n` + JSON.stringify(body.serviceSpecificData, null, 2)
              });
            } catch {
              // Ignore note insertion failure
            }
          }
        } else if (leadErr) {
          console.warn("[Intake DB Insert Warning]", leadErr);
        }
      } catch (dbErr) {
        console.error("[Intake DB Exception]", dbErr);
      }
    }

    // 5. Operational Pipeline Execution (Asynchronous, Non-blocking)
    try {
      await executeOperationalPipeline({
        sourceName: `Intake Form: ${fullName}`,
        sourceType: "FORM_SUBMISSION",
        sourceUrl: pageUrl,
        triggerType: "WEBHOOK",
        entityNameCandidate: body.companyName || fullName,
        eventType: "COMMERCIAL_INQUIRY",
        evidenceText: `Verified ${serviceTitle} intake from ${email || phone} (Urgency: ${urgencyDisplay})`,
        commercialRelevance: urgencyDisplay === "Urgent" || urgencyDisplay === "Foarte urgent" ? "CRITICAL" : "HIGH",
        rawPayload: {
          leadId,
          dbRecordId,
          name: fullName,
          email,
          phone,
          company: body.companyName,
          service: serviceTitle,
          role: roleDisplay,
          project: body.projectName,
          stage: body.projectStage,
          urgency: urgencyDisplay,
          submittedAt: timestamp
        }
      });
    } catch (pipeErr) {
      console.error("[Operational Pipeline Exception]", pipeErr);
    }

    // 6. Telegram Operational Notification Delivery
    const leadTelegramData: LeadTelegramData = {
      leadId,
      fullName,
      phone: phone || null,
      email: email || null,
      companyName: body.companyName || null,
      companyRole: roleDisplay,
      serviceInterest: serviceTitle,
      serviceCategory,
      preferredContact: body.preferredContact || "Telefon",
      urgency: urgencyDisplay,
      message: body.message || null,
      projectName: body.projectName || null,
      projectType: body.projectType || null,
      projectStage: body.projectStage || null,
      projectLocation: projectLocation || null,
      financingInterest: body.financingInterest || body.serviceSpecificData?.financingInterest || null,
      insuranceInterest: body.insuranceInterest || body.serviceSpecificData?.insuranceInterest || null,
      visitorId: body.visitorId || null,
      sessionId: body.sessionId || null,
      landingPath,
      previousPath: body.previousPath || null,
      source,
      deviceCategory: body.deviceCategory || "Desktop",
      browser: body.browser || "Safari",
      os: body.os || "macOS",
      sessionDuration: body.sessionDuration || null,
      submittedAt: timestamp,
      serviceSpecificData: body.serviceSpecificData || null
    };

    const telegramText = formatLeadTelegramMessage(leadTelegramData);
    const telegramSent = await sendTelegramNotification(telegramText);

    if (!telegramSent) {
      console.error("[TELEGRAM_NOTIFICATION_FAILED]", {
        leadId,
        service: serviceTitle,
        timestamp
      });
    }

    // 7. Success Response (Never fails lead submission to the visitor)
    return NextResponse.json(
      {
        ok: true,
        leadId,
        telegramDelivered: telegramSent,
        message: "Solicitarea a fost transmisă. Am primit informațiile tale și solicitarea a fost înregistrată."
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Intake API Route Exception]", err);
    return NextResponse.json(
      { ok: false, error: "A apărut o eroare la transmiterea solicitării. Te rugăm să încerci din nou." },
      { status: 500 }
    );
  }
}
