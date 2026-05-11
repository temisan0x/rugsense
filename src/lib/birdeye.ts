const BASE_URL = 'https://public-api.birdeye.so'

function makeHeaders() {
  return {
    'X-API-KEY': process.env.BIRDEYE_API_KEY!,
    'accept': 'application/json',
    'x-chain': 'solana',
  }
}

/**
 * Primary data source — available on all tiers including Starter/Free.
 * Returns: name, symbol, liquidity, v24hUSD, price, holder, extensions, etc.
 * NOTE: some fields are null for very new/low-volume tokens — that's real data.
 */
export async function getTokenOverview(address: string) {
  const url = `${BASE_URL}/defi/token_overview?address=${address}`
  console.log('[birdeye] GET', url)

  const res = await fetch(url, {
    headers: makeHeaders(),
    next: { revalidate: 30 },
  })

  const json = await res.json()
  console.log('[birdeye] token_overview status:', res.status, '| success:', json?.success)

  if (!res.ok || !json?.success) {
    throw new Error(`token_overview failed: ${res.status} — ${JSON.stringify(json)}`)
  }

  return json 
}

/**
 * Holder list — available on Starter and above.
 * Returns top holders with percentage ownership.
 */
export async function getTopHolders(address: string) {
  const url = `${BASE_URL}/v1/token/holder?address=${address}&limit=10`
  const res = await fetch(url, {
    headers: makeHeaders(),
    next: { revalidate: 60 },
  })

  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    console.warn('[birdeye] holder endpoint returned non-JSON:', res.status, contentType)
    return { success: false, data: { items: [] } }
  }

  const json = await res.json()
  if (!res.ok || !json?.success) {
    console.warn('[birdeye] holder fetch failed:', json)
    return { success: false, data: { items: [] } }
  }
  return json
}

export function calculateTop10Ownership(holders: any[]): number {
  if (!Array.isArray(holders) || holders.length === 0) return 0
  return holders
    .slice(0, 10)
    .reduce((acc, h) => {
      const raw = Number(h.percentage ?? h.uiAmountPercentage ?? 0)
      return acc + raw
    }, 0)
}