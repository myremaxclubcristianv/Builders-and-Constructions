export async function sendTelegramNotification(text: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId || botToken.trim() === '' || chatId.trim() === '') {
    console.warn('[TELEGRAM_NOTIFICATION_FAILED] Missing or unconfigured TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data || data.ok !== true) {
      console.error('[TELEGRAM_NOTIFICATION_FAILED]', {
        status: res.status,
        description: data?.description || 'Unknown Telegram Error'
      });
      return false;
    }

    return true;
  } catch (err) {
    console.error('[TELEGRAM_NOTIFICATION_FAILED] Exception during Telegram API call:', err);
    return false;
  }
}
