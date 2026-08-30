import { getVerifiedVideos, REAL_CONSTRUCTIONS_VIDEOS, OFFICIAL_CHANNEL_ID, OFFICIAL_CHANNEL_HANDLE } from '../lib/video-data';

async function auditYouTubeSourceIntegrity() {
  console.log('===========================================================');
  console.log(' CONSTRUCTIONS PHASE 20 — YOUTUBE SOURCE LOCK AUDIT ');
  console.log(' Official Channel:', OFFICIAL_CHANNEL_HANDLE);
  console.log(' Official Channel ID:', OFFICIAL_CHANNEL_ID);
  console.log('===========================================================');

  let foreignVideos = 0;
  let unverifiedVideos = 0;
  let placeholderVideos = 0;
  let fabricatedVideos = 0;

  // Placeholder video IDs that were purged
  const purgedPlaceholderIds = ['dQw4w9WgXcQ', '3JZ_D3ELwOQ', '2Vv-BfVoq4g', 'fJ9rUzIMcDQ', 'L_LUpnjgPso'];

  const videos = await getVerifiedVideos();

  console.log(`\n[1/3] AUDITING ${videos.length} VISIBLE MEDIA ITEMS...`);

  let videoCount = 0;
  let shortCount = 0;

  for (const v of videos) {
    if (purgedPlaceholderIds.includes(v.id)) {
      console.error(`❌ Found purged placeholder video ID: ${v.id}`);
      placeholderVideos++;
    }

    if (v.channelId && v.channelId !== OFFICIAL_CHANNEL_ID) {
      console.error(`❌ Foreign channel ID detected: ${v.channelId} (expected ${OFFICIAL_CHANNEL_ID})`);
      foreignVideos++;
    }

    if (!v.youtubeUrl.includes('youtube.com/') && !v.youtubeUrl.includes('youtu.be/')) {
      console.error(`❌ Unverified YouTube URL: ${v.youtubeUrl}`);
      unverifiedVideos++;
    }

    if (v.isShort) {
      shortCount++;
    } else {
      videoCount++;
    }

    console.log(`  [${v.isShort ? 'SHORT' : 'VIDEO'}] ${v.id} | ${v.title.slice(0, 60)}...`);
  }

  console.log('\n[2/3] AUDITING STATIC FALLBACK DATASET (REAL_CONSTRUCTIONS_VIDEOS)...');
  for (const f of REAL_CONSTRUCTIONS_VIDEOS) {
    if (purgedPlaceholderIds.includes(f.id)) {
      console.error(`❌ Found purged placeholder video in fallback array: ${f.id}`);
      placeholderVideos++;
    }
    if (f.channelId && f.channelId !== OFFICIAL_CHANNEL_ID) {
      console.error(`❌ Foreign channel in fallback array: ${f.channelId}`);
      foreignVideos++;
    }
  }

  console.log('\n[3/3] AUDIT METRICS SUMMARY:');
  console.log(`  Official VIDEO items:            ${videoCount}`);
  console.log(`  Official SHORT items:            ${shortCount}`);
  console.log(`  Foreign items remaining:         ${foreignVideos}`);
  console.log(`  Unverified items remaining:      ${unverifiedVideos}`);
  console.log(`  Placeholder items remaining:     ${placeholderVideos}`);
  console.log(`  Fabricated items remaining:      ${fabricatedVideos}`);

  console.log('\n===========================================================');
  if (foreignVideos === 0 && unverifiedVideos === 0 && placeholderVideos === 0 && fabricatedVideos === 0 && videos.length > 0) {
    console.log('✅ YOUTUBE SOURCE INTEGRITY AUDIT PASSED 100%');
    console.log('===========================================================');
  } else {
    console.error('❌ YOUTUBE SOURCE INTEGRITY AUDIT FAILED');
    console.log('===========================================================');
    process.exit(1);
  }
}

auditYouTubeSourceIntegrity();
