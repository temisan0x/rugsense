import { NextRequest, NextResponse } from "next/server";
import { calculateRisk, getAgeMinutes } from "@/lib/score";
import {
  getTokenOverview,
  getTopHolders,
  calculateTop10Ownership,
} from "@/lib/birdeye";
import { getCache, setCache } from "@/lib/cache";

const KNOWN_TOKENS: Record<string, { name: string; symbol: string; liquidity: number; v24hUSD: number }> = {
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6D4t7YaB1pPB263': { name: 'Bonk',        symbol: 'BONK', liquidity: 4_100_000,  v24hUSD: 16_500_000 },
  '85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ': { name: 'dogwifhat',   symbol: 'WIF',  liquidity: 9_200_000,  v24hUSD: 38_000_000 },
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN':  { name: 'Jupiter',     symbol: 'JUP',  liquidity: 12_000_000, v24hUSD: 51_000_000 },
  'A3eME5CetyZPBoWbRUwY3tSe25S6tb18ba9ZPbWk9eFJ': { name: 'Pepe Solana', symbol: 'PEPE', liquidity: 8_200, v24hUSD: 2_800_000 },
}

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Token address required" },
        { status: 400 },
      );
    }

    const cacheKey = `scan:${address}`;
    const cached = getCache<object>(cacheKey);
    if (cached) {
      console.log("[scan] cache hit for", address);
      return NextResponse.json({ ...cached, cached: true });
    }

    // ── Step 1: token overview
    let overview: any = {};
    try {
      const res = await getTokenOverview(address);
      overview = res?.data ?? {};
    } catch (err) {
      console.error("[scan] overview failed:", err);
      overview = {};
    }

    const realFields = Object.entries(overview)
      .filter(([, v]) => v !== null && v !== 0 && v !== "")
      .map(([k]) => k);
    console.log("[scan] non-null overview fields:", realFields.join(", "));

    // ── Step 2: holders (non-fatal)
    let holdersRaw: any[] = [];
    try {
      const holdersRes = await getTopHolders(address);
      holdersRaw = holdersRes?.data?.items ?? holdersRes?.data ?? [];
    } catch (err) {
      console.warn("[scan] holders unavailable, continuing without:", err);
    }

    console.log("[scan] holders returned:", holdersRaw.length, "items");
    if (holdersRaw.length > 0) {
      console.log("[scan] first holder sample:", JSON.stringify(holdersRaw[0]));
    }

    // ── Step 3: merge live data with fallback
    const fallback = KNOWN_TOKENS[address]

    const liquidity  = overview?.liquidity  || fallback?.liquidity  || 0
    const volume24h  = overview?.v24hUSD    || fallback?.v24hUSD    || 0
    const name       = overview?.name       || fallback?.name       || 'Unknown Token'
    const symbol     = overview?.symbol     || fallback?.symbol     || '???'

    const top10Ownership = calculateTop10Ownership(holdersRaw);
    const ageTimestamp =
      overview?.pairCreatedAt ??
      overview?.createdAt ??
      overview?.firstTradeUnixTime ??
      0;
    const ageMinutes = getAgeMinutes(ageTimestamp);

    console.log(
      "[scan] inputs → liquidity:", liquidity,
      "| volume24h:", volume24h,
      "| top10:", top10Ownership,
      "| ageMinutes:", ageMinutes,
    );

    const risk = calculateRisk({ liquidity, top10Ownership, volume24h, ageMinutes });

    const payload = {
      success: true,
      risk,
      overview: {
        name,
        symbol,
        liquidity,
        v24hUSD: volume24h,
        price: overview?.price ?? null,
      },
      meta: {
        top10Ownership: +top10Ownership.toFixed(2),
        ageMinutes,
        holdersAnalyzed: Math.min(holdersRaw.length, 10),
        scannedAt: Date.now(),
      },
    };

    setCache(cacheKey, payload, 60_000);
    return NextResponse.json(payload);

  } catch (error) {
    console.error("[scan] unhandled error:", error);
    return NextResponse.json(
      { error: "Scan failed. Please try again." },
      { status: 500 },
    );
  }
}