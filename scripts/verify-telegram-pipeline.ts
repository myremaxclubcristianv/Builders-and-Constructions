import { sendTelegramNotification } from '../lib/telegram';

async function testTelegramPipeline() {
  console.log('===========================================================');
  console.log(' TELEGRAM END-TO-END NOTIFICATION PIPELINE VERIFICATION ');
  console.log('===========================================================');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log('1. TELEGRAM ENVIRONMENT CONFIGURATION:');
  console.log('   - TELEGRAM_BOT_TOKEN:', botToken ? `PRESENT (Length: ${botToken.length})` : 'MISSING / EMPTY');
  console.log('   - TELEGRAM_CHAT_ID:', chatId ? `PRESENT (Value: ${chatId})` : 'MISSING / EMPTY');

  if (!botToken || !chatId || botToken.trim() === '' || chatId.trim() === '') {
    console.error('❌ TELEGRAM DELIVERY: NOT VERIFIED — Missing bot token or chat ID environment variables');
    process.exit(1);
  }

  const timestamp = new Date().toISOString();
  const testMessage = [
    `<b>NEW CONSTRUCTIONS RESEARCH REQUEST</b>`,
    `<b>Subject:</b> Research Request — Subject: Verification Diagnostic Test`,
    `<b>Entity / Organization:</b> CONSTRUCTIONS Verification Suite`,
    `<b>Name:</b> Operational Verification Bot`,
    `<b>Email:</b> verification@constructions.cristianvaduva.com`,
    `<b>Category:</b> Pipeline Verification Test`,
    `<b>Details:</b> End-to-end production pipeline verification test`,
    `<b>Source:</b> https://constructions.cristianvaduva.com/verification-test`,
    `<b>Timestamp:</b> ${timestamp}`
  ].join('\n');

  console.log('\n2. EXECUTING TELEGRAM API TEST REQUEST...');
  const success = await sendTelegramNotification(testMessage);

  console.log('\n3. TELEGRAM VERIFICATION RESULT:');
  if (success) {
    console.log('✅ TELEGRAM DELIVERY: VERIFIED — Test notification successfully accepted by Telegram API');
  } else {
    console.error('❌ TELEGRAM DELIVERY: NOT VERIFIED — Telegram API call failed or returned ok: false');
    process.exit(1);
  }
  console.log('===========================================================');
}

testTelegramPipeline();
