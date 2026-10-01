/**
 * Telegram Operational Notification Utility
 * CONSTRUCTIONS by AiXLuxury
 *
 * Dispatches operational leads and telemetry events to the internal Telegram channel.
 * Implements fault-tolerant HTML formatting with automatic plain-text fallback on entity parse errors.
 */

export async function sendTelegramNotification(text: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim().replace(/^[\"']|[\"']$/g, "");
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim().replace(/^[\"']|[\"']$/g, "");

  if (!botToken || !chatId || botToken === "" || chatId === "") {
    console.warn("[TELEGRAM_NOTIFICATION_FAILED] Missing or unconfigured TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return false;
  }

  try {
    // 1. Primary Delivery Attempt: HTML Parse Mode
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML"
      })
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data && data.ok === true) {
      return true;
    }

    // 2. Fallback Attempt: If HTML entity parsing fails, retry with stripped plain text
    console.warn("[TELEGRAM_HTML_RETRY] HTML parse failed, retrying plain text fallback:", {
      status: res.status,
      description: data?.description || "Unknown Telegram Error"
    });

    const plainText = text
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"");

    const fallbackRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: plainText
      })
    });

    const fallbackData = await fallbackRes.json().catch(() => null);

    if (fallbackRes.ok && fallbackData && fallbackData.ok === true) {
      return true;
    }

    console.error("[TELEGRAM_NOTIFICATION_FAILED]", {
      status: fallbackRes.status,
      description: fallbackData?.description || "Unknown Telegram Error"
    });
    return false;
  } catch (err) {
    console.error("[TELEGRAM_NOTIFICATION_FAILED] Exception during Telegram API call:", err);
    return false;
  }
}
