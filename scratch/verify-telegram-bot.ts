import { sendTelegramNotification } from '../lib/telegram';

async function diagnoseTelegram() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log('===========================================================');
  console.log(' TELEGRAM PRODUCTION ENVIRONMENT & DELIVERY DIAGNOSTIC ');
  console.log('===========================================================');

  console.log('1. ENVIRONMENT VARIABLE PRESENCE:');
  console.log('   - TELEGRAM_BOT_TOKEN:', token && token.trim() !== '' ? `PRESENT (Length: ${token.length})` : 'MISSING / EMPTY');
  console.log('   - TELEGRAM_CHAT_ID:', chatId && chatId.trim() !== '' ? `PRESENT (Length: ${chatId.length})` : 'MISSING / EMPTY');

  if (!token || !chatId || token.trim() === '' || chatId.trim() === '') {
    console.error('❌ TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing or empty in environment.');
    process.exit(1);
  }

  // 2. BOT AUTHENTICATION (getMe)
  console.log('\n2. TESTING TELEGRAM BOT AUTHENTICATION (getMe)...');
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json().catch(() => null);
    if (res.ok && data?.ok === true) {
      console.log('   Bot authentication: PASS');
      console.log('   Bot username: @' + (data.result?.username || 'unknown'));
    } else {
      console.error('   Bot authentication: FAIL', res.status, data?.description || data);
      process.exit(1);
    }
  } catch (err) {
    console.error('   Bot authentication EXCEPTION:', err);
    process.exit(1);
  }

  // 3. CHAT DELIVERY TEST (sendMessage)
  console.log('\n3. TESTING TELEGRAM CHAT DELIVERY (sendMessage)...');
  const testMessage = [
    `<b>CONSTRUCTIONS — PRODUCTION TELEGRAM TEST</b>`,
    ``,
    `This is an internal infrastructure verification message from the CONSTRUCTIONS desk.`,
    ``,
    `<b>Status:</b> Operational Pipeline Diagnostic`,
    `<b>Timestamp:</b> ${new Date().toISOString()}`
  ].join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.ok === true) {
      console.log('   Telegram API response: PASS (ok: true)');
      console.log('   Message ID:', data.result?.message_id);
      console.log('   Actual Telegram message sent: PASS');
    } else {
      console.error('   Telegram API response: FAIL', res.status, data?.description || data);
      process.exit(1);
    }
  } catch (err) {
    console.error('   Telegram sendMessage EXCEPTION:', err);
    process.exit(1);
  }

  console.log('\n===========================================================');
  console.log('✅ TELEGRAM DIAGNOSTIC COMPLETED SUCCESSFULLY');
  console.log('===========================================================');
}

diagnoseTelegram();
