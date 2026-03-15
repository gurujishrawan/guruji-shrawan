// app/api/youtube-sync/route.ts
// Move supabaseAdmin INSIDE the handler — not at module level.
// Module-level createClient() crashes at build time when env vars
// are not yet available in the Vercel build environment.

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function inferCategory(title: string): string {
  const t = title.toLowerCase()
  if (t.includes("meditation") || t.includes("ध्यान"))                   return "Meditation"
  if (t.includes("vedant")    || t.includes("वेदांत"))                   return "Vedanta"
  if (t.includes("relation")  || t.includes("संबंध"))                   return "Relationships"
  if (t.includes("youth")     || t.includes("युवा"))                     return "Youth"
  if (t.includes("question")  || t.includes("q&a") || t.includes("सवाल")) return "Q&A"
  if (t.includes("book")      || t.includes("पुस्तक"))                  return "Books"
  return "Satsang"
}

function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "—"
  const h = parseInt(match[1] || "0")
  const m = parseInt(match[2] || "0")
  const s = parseInt(match[3] || "0")
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

async function handleSync(req: NextRequest) {
  // ✅ Create Supabase client INSIDE the function, not at module level
  const supabaseUrl       = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const YT_KEY             = process.env.YOUTUBE_API_KEY
  const CHANNEL_ID         = process.env.YOUTUBE_CHANNEL_ID

  // Guard: return friendly error if env vars missing at runtime
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Supabase environment variables are not configured." },
      { status: 500 }
    )
  }
  if (!YT_KEY || !CHANNEL_ID) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID not set in environment variables." },
      { status: 500 }
    )
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const chanRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YT_KEY}`
    )
    const chanData = await chanRes.json()
    const uploadsPlaylistId = chanData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
    if (!uploadsPlaylistId) throw new Error("Could not find uploads playlist for this channel ID.")

    const playRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YT_KEY}`
    )
    const playData = await playRes.json()
    const items = playData.items || []
    if (items.length === 0) return NextResponse.json({ synced: 0, message: "No videos found." })

    const ids = items.map((i: any) => i.snippet.resourceId.videoId).join(",")
    const detailRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${ids}&key=${YT_KEY}`
    )
    const detailData = await detailRes.json()
    const detailMap: Record<string, any> = {}
    for (const d of detailData.items || []) detailMap[d.id] = d

    let synced = 0
    for (const item of items) {
      const snippet  = item.snippet
      const ytId     = snippet.resourceId.videoId
      const detail   = detailMap[ytId]
      const duration = detail ? formatDuration(detail.contentDetails.duration) : "—"
      const views    = parseInt(detail?.statistics?.viewCount || "0")

      const { error } = await supabaseAdmin.from("vg_videos").upsert(
        { youtube_id: ytId, title: snippet.title, description: (snippet.description || "").slice(0, 600), category: inferCategory(snippet.title), duration, views },
        { onConflict: "youtube_id", ignoreDuplicates: false }
      )
      if (!error) synced++
    }

    return NextResponse.json({ synced, total: items.length, message: `Synced ${synced} of ${items.length} videos.` })
  } catch (err: any) {
    console.error("YouTube sync error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) { return handleSync(req) }
export async function GET(req:  NextRequest) { return handleSync(req) }