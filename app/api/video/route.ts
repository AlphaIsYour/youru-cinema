// app/api/video/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCachedStream } from "@/app/lib/videoProviders";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const animeTitle = searchParams.get("title");
  const episode = searchParams.get("episode");

  if (!animeTitle || !episode) {
    return NextResponse.json(
      { error: "Missing title or episode parameter" },
      { status: 400 },
    );
  }

  const episodeNumber = parseInt(episode, 10);

  try {
    console.log("🔍 Trying to fetch:", animeTitle, "Episode", episodeNumber);

    const streamData = await getCachedStream(animeTitle, episodeNumber);

    if (!streamData || !streamData.sources || streamData.sources.length === 0) {
      console.warn("⚠️  All providers failed, using test stream");

      return NextResponse.json({
        sources: [
          {
            url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            quality: "auto",
            isM3U8: true,
          },
        ],
        subtitles: [],
        warning: "Real anime source unavailable. Showing test stream.",
      });
    }

    return NextResponse.json(streamData);
  } catch (error) {
    console.error("❌ Video API error:", error);

    return NextResponse.json({
      sources: [
        {
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          quality: "auto",
          isM3U8: true,
        },
      ],
      subtitles: [],
      warning: "Error fetching video. Showing test stream.",
    });
  }
}
