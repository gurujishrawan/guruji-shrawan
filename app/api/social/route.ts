import { NextResponse } from "next/server";

const DEFAULT_LINKS = {
  youtube: "https://www.youtube.com",
  instagram: "https://www.instagram.com",
  facebook: "https://www.facebook.com",
  x: "https://x.com",
};

async function fetchJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return res.json();
}

export async function GET() {
  const youtubeChannelId = process.env.SOCIAL_YOUTUBE_CHANNEL_ID;
  const youtubeApiKey = process.env.SOCIAL_YOUTUBE_API_KEY;
  const instagramUserId = process.env.SOCIAL_INSTAGRAM_USER_ID;
  const facebookPageId = process.env.SOCIAL_FACEBOOK_PAGE_ID;
  const facebookToken = process.env.SOCIAL_FACEBOOK_TOKEN;
  const xHandle = process.env.SOCIAL_X_HANDLE;

  const links = {
    youtube: process.env.SOCIAL_YOUTUBE_URL || DEFAULT_LINKS.youtube,
    instagram: process.env.SOCIAL_INSTAGRAM_URL || DEFAULT_LINKS.instagram,
    facebook: process.env.SOCIAL_FACEBOOK_URL || DEFAULT_LINKS.facebook,
    x: process.env.SOCIAL_X_URL || DEFAULT_LINKS.x,
  };

  const counts: Record<string, string | null> = {
    youtube: null,
    instagram: null,
    facebook: null,
    x: null,
  };

  const tasks: Promise<void>[] = [];

  if (xHandle) {
    tasks.push(
      fetchJson(
        `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${xHandle}`,
      )
        .then((data: Array<{ followers_count: number }>) => {
          counts.x = data?.[0]?.followers_count
            ? data[0].followers_count.toLocaleString()
            : null;
          links.x = `https://x.com/${xHandle}`;
        })
        .catch(() => null),
    );
  }

  if (youtubeChannelId && youtubeApiKey) {
    tasks.push(
      fetchJson(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${youtubeChannelId}&key=${youtubeApiKey}`,
      )
        .then((data: any) => {
          const count = data?.items?.[0]?.statistics?.subscriberCount;
          counts.youtube = count ? Number(count).toLocaleString() : null;
        })
        .catch(() => null),
    );
  }

  if (instagramUserId && facebookToken) {
    tasks.push(
      fetchJson(
        `https://graph.facebook.com/v18.0/${instagramUserId}?fields=followers_count&access_token=${facebookToken}`,
      )
        .then((data: any) => {
          counts.instagram = data?.followers_count
            ? Number(data.followers_count).toLocaleString()
            : null;
        })
        .catch(() => null),
    );
  }

  if (facebookPageId && facebookToken) {
    tasks.push(
      fetchJson(
        `https://graph.facebook.com/v18.0/${facebookPageId}?fields=followers_count&access_token=${facebookToken}`,
      )
        .then((data: any) => {
          counts.facebook = data?.followers_count
            ? Number(data.followers_count).toLocaleString()
            : null;
        })
        .catch(() => null),
    );
  }

  await Promise.all(tasks);

  return NextResponse.json({ counts, links });
}
