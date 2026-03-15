// app/api/youtube-sync/route.ts
// ══════════════════════════════════════════════════
//  YouTube Auto-Sync API Route
//  Fetches your latest YouTube uploads and upserts
//  them into vg_videos table automatically.
//
//  SETUP:
//  1. Get a YouTube Data API v3 key from Google Cloud Console
//  2. Find your channel ID: youtube.com → your channel → About → Share → Copy Channel ID
//  3. Add to .env.local:
//       YOUTUBE_API_KEY=AIza...
//       YOUTUBE_CHANNEL_ID=UC...
//       CRON_SECRET=your-random-secret-string
//  4. Call POST /api/youtube-sync (admin button does this)
//  5. For automatic daily sync, add a Vercel Cron Job:
//       vercel.json → { "crons": [{ "path": "/api/youtube-sync", "schedule": "0 6 * * *" }] }
// ══════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* ── service role client (bypasses RLS) ── */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // add this to .env.local
)

const YT_KEY    = process.env.YOUTUBE_API_KEY!
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!

/* Map YouTube category IDs → our categories */
function inferCategory(title: string): string {
  const t = title.toLowerCase()
  if (t.includes("meditation") || t.includes("ध्यान"))          return "Meditation"
  if (t.includes("vedant") || t.includes("वेदांत"))             return "Vedanta"
  if (t.includes("relation") || t.includes("संबंध"))            return "Relationships"
  if (t.includes("youth") || t.includes("युवा"))                return "Youth"
  if (t.includes("question") || t.includes("q&a") || t.includes("सवाल")) return "Q&A"
  if (t.includes("book") || t.includes("पुस्तक"))               return "Books"
  return "Satsang"
}

/* Format ISO 8601 duration to MM:SS */
function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "—"
  const h = parseInt(match[1]||"0")
  const m = parseInt(match[2]||"0")
  const s = parseInt(match[3]||"0")
  if (h>0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`
  return `${m}:${String(s).padStart(2,"0")}`
}

export async function POST(req: NextRequest) {
  /* optional auth check for cron */
  const secret = req.headers.get("x-cron-secret")
  const body   = await req.json().catch(()=>({}))
  if (secret && secret !== process.env.CRON_SECRET && !body.admin) {
    return NextResponse.json({ error:"Unauthorized" }, { status:401 })
  }

  if (!YT_KEY || !CHANNEL_ID) {
    return NextResponse.json({
      error: "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID in environment variables"
    }, { status: 500 })
  }

  try {
    /* 1. Get uploads playlist ID for the channel */
    const chanRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YT_KEY}`
    )
    const chanData = await chanRes.json()
    const uploadsPlaylistId = chanData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
    if (!uploadsPlaylistId) throw new Error("Could not find uploads playlist")

    /* 2. Fetch up to 50 latest videos from uploads playlist */
    const playRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YT_KEY}`
    )
    const playData = await playRes.json()
    const items = playData.items || []

    if (items.length === 0) {
      return NextResponse.json({ synced: 0, message: "No videos found" })
    }

    /* 3. Get video details (duration, etc.) */
    const ids = items.map((i: any) => i.snippet.resourceId.videoId).join(",")
    const detailRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${ids}&key=${YT_KEY}`
    )
    const detailData = await detailRes.json()
    const detailMap: Record<string, any> = {}
    for (const d of detailData.items || []) {
      detailMap[d.id] = d
    }

    /* 4. Upsert into Supabase */
    let synced = 0
    for (const item of items) {
      const snippet = item.snippet
      const ytId    = snippet.resourceId.videoId
      const detail  = detailMap[ytId]
      const duration = detail ? formatDuration(detail.contentDetails.duration) : "—"
      const views    = parseInt(detail?.statistics?.viewCount || "0")

      const { error } = await supabaseAdmin.from("vg_videos").upsert({
        youtube_id:  ytId,
        title:       snippet.title,
        description: snippet.description?.slice(0, 600) || "",
        category:    inferCategory(snippet.title),
        duration:    duration,
        views:       views,
        /* preserve existing likes, don't overwrite */
      }, {
        onConflict: "youtube_id",
        ignoreDuplicates: false,
      })

      if (!error) synced++
    }

    return NextResponse.json({
      synced,
      total: items.length,
      message: `Synced ${synced} of ${items.length} videos from YouTube`,
    })

  } catch (err: any) {
    console.error("YouTube sync error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/* Allow GET for Vercel Cron */
export async function GET(req: NextRequest) {
  return POST(req)
}