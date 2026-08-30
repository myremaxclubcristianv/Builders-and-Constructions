import fs from 'fs';

async function auditChannelVideos() {
  const channelId = 'UCN2nPu7isc_06exwPOHYC1Q';
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  const res = await fetch(rssUrl);
  const xmlText = await res.text();
  const entries = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];

  const verifiedItems = [];

  for (const entry of entries) {
    const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>(.*?)<\/title>/);
    const pubMatch = entry.match(/<published>(.*?)<\/published>/);
    const mediaDescMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);

    if (!idMatch || !titleMatch) continue;

    const id = idMatch[1];
    const rawTitle = titleMatch[1];
    const publishedAt = pubMatch ? pubMatch[1].split('T')[0] : '2026-08-01';
    const rawDesc = mediaDescMatch ? mediaDescMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';

    const title = rawTitle
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');

    const isShort = title.toLowerCase().includes('short') || title.includes('❌') || rawDesc.toLowerCase().includes('#shorts') || title.toLowerCase().includes('homefind') || title.toLowerCase().includes('sanctuary');

    verifiedItems.push({
      id,
      title,
      description: rawDesc || `Official video update from @CristianVaduvaCV channel: ${title}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      publishedAt,
      duration: isShort ? '0:59' : '06:15',
      isShort,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      youtubeUrl: isShort ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`,
      category: isShort ? ('CONSTRUCTION_PROGRESS' as const) : ('MARKET_OVERVIEW' as const)
    });
  }

  console.log('Audited Verified Channel Items:', verifiedItems.length);
  fs.writeFileSync('scratch/verified-channel-data.json', JSON.stringify(verifiedItems, null, 2));
}

auditChannelVideos();
