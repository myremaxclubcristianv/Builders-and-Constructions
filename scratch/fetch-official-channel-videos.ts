async function fetchOfficialChannelVideos() {
  const channelId = 'UCN2nPu7isc_06exwPOHYC1Q';
  console.log('Fetching official YouTube channel content for channel ID:', channelId);

  // Try RSS Feed first (Public, No API key required)
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  try {
    const res = await fetch(rssUrl);
    if (res.ok) {
      const xmlText = await res.text();
      console.log('RSS Feed Length:', xmlText.length);

      // Parse video entries from XML
      const entries = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];
      console.log('Found RSS entries:', entries.length);

      for (const entry of entries) {
        const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
        const titleMatch = entry.match(/<title>(.*?)<\/title>/);
        const publishedMatch = entry.match(/<published>(.*?)<\/published>/);

        if (videoIdMatch && titleMatch) {
          console.log({
            id: videoIdMatch[1],
            title: titleMatch[1],
            published: publishedMatch ? publishedMatch[1] : null
          });
        }
      }
    } else {
      console.log('RSS Feed status:', res.status);
    }
  } catch (err) {
    console.error('RSS Feed error:', err);
  }

  // Also check if YOUTUBE_API_KEY is available in env
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const apiRes = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50`);
      if (apiRes.ok) {
        const data = await apiRes.json();
        console.log('YouTube API Items count:', data.items?.length);
      }
    } catch (e) {
      console.error('YouTube API error:', e);
    }
  }
}

fetchOfficialChannelVideos();
