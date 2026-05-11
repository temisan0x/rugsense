const BASE_URL = 'https://public-api.birdeye.so'

const headers = {
  'X-API-KEY': process.env.BIRDEYE_API_KEY!,
  accept: 'application/json',
}

export async function getTopHolders(address: string) {
  const res = await fetch(
    `${BASE_URL}/defi/v3/token/holder?address=${address}&limit=10`,
    {
      headers,
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch holders')
  }

  return res.json()
}

export function calculateTop10Ownership(holders: any[]): number {
  if (!Array.isArray(holders) || holders.length === 0) return 0
  return holders
    .slice(0, 10)
    .reduce((acc, holder) => acc + Number(holder.percentage ?? holder.uiAmountPercentage ?? 0), 0)
}