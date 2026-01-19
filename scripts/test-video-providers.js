// scripts/test-video-providers.js
/* eslint-disable @typescript-eslint/no-unused-vars */
const CONSUMET_API = "http://localhost:3001";

async function testGogoanimeSearch(title) {
  console.log(`\n🔍 Testing Gogoanime Search: "${title}"`);

  try {
    const searchUrl = `${CONSUMET_API}/anime/gogoanime/${encodeURIComponent(title)}`;
    console.log(`📡 URL: ${searchUrl}`);

    const response = await fetch(searchUrl);

    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Content-Type: ${response.headers.get("content-type")}`);

    const text = await response.text();
    console.log(`📝 Response preview: ${text.substring(0, 200)}`);

    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status}`);
      return null;
    }

    const data = JSON.parse(text);

    if (data.results && data.results.length > 0) {
      console.log("✅ Found:", data.results[0].id);
      return data.results[0].id;
    } else {
      console.log("❌ Not found");
      return null;
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
    return null;
  }
}

async function testGetEpisodes(gogoanimeId) {
  console.log(`\n📺 Testing Get Episodes: "${gogoanimeId}"`);

  try {
    const infoUrl = `${CONSUMET_API}/anime/gogoanime/info/${gogoanimeId}`;
    console.log(`📡 URL: ${infoUrl}`);

    const response = await fetch(infoUrl);

    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.episodes) {
      console.log(`✅ Found ${data.episodes.length} episodes`);
      console.log("First episode:", data.episodes[0]);
      return data.episodes;
    } else {
      console.log("❌ No episodes found");
      return null;
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    return null;
  }
}

async function testGetStreaming(episodeId) {
  console.log(`\n🎥 Testing Get Streaming: "${episodeId}"`);

  try {
    const streamUrl = `${CONSUMET_API}/anime/gogoanime/watch/${episodeId}`;
    console.log(`📡 URL: ${streamUrl}`);

    const response = await fetch(streamUrl);

    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.sources && data.sources.length > 0) {
      console.log("✅ Found video sources:");
      data.sources.forEach((source) => {
        console.log(`  - ${source.quality}: ${source.url.substring(0, 50)}...`);
      });

      if (data.subtitles) {
        console.log("✅ Found subtitles:");
        data.subtitles.forEach((sub) => {
          console.log(`  - ${sub.lang}`);
        });
      }

      return data;
    } else {
      console.log("❌ No sources found");
      return null;
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    return null;
  }
}

async function testAPIHealth() {
  console.log("\n🏥 Testing API Health...");

  try {
    const response = await fetch(`${CONSUMET_API}`);
    console.log(`📊 Status: ${response.status}`);

    const text = await response.text();
    console.log(`📝 Response: ${text.substring(0, 200)}`);

    return response.ok;
  } catch (error) {
    console.error("❌ API not reachable:", error.message);
    return false;
  }
}

async function exploreEndpoints() {
  console.log("\n🔍 Exploring Available Endpoints...");

  const endpoints = [
    "/anime/gogoanime",
    "/meta/anilist/naruto",
    "/anime/zoro/naruto",
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing: ${CONSUMET_API}${endpoint}`);
      const response = await fetch(`${CONSUMET_API}${endpoint}`);
      console.log(`   Status: ${response.status}`);

      if (response.ok) {
        const text = await response.text();
        console.log(`   Preview: ${text.substring(0, 150)}...`);
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
}

async function runTests() {
  console.log("🚀 Starting Video Provider Tests...\n");
  console.log("=".repeat(50));

  const isHealthy = await testAPIHealth();

  if (!isHealthy) {
    console.log("\n❌ API is not running or not reachable");
    console.log("💡 Make sure consumet API is running on port 3001");
    console.log("   Run: cd api.consumet.org && PORT=3001 npm start");
    return;
  }

  await exploreEndpoints();

  console.log("\n" + "=".repeat(50));
  console.log("\n💡 Checking Consumet API docs...");
  console.log("   Visit: https://docs.consumet.org/");
  console.log("   Or check: https://github.com/consumet/api.consumet.org");
}

runTests();
