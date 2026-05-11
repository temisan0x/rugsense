export type RiskResult = {
  score: number
  label: 'SAFE' | 'WATCH' | 'DANGER'
  reasons: string[]
  confidence: number
}

type ScoreInput = {
  liquidity: number
  top10Ownership: number
  volume24h: number
  ageMinutes: number
}

export function calculateRisk(data: ScoreInput): RiskResult {
  let score = 0
  const reasons: string[] = []
  let dataPoints = 0 

  // ── Holder concentration
  if (data.top10Ownership > 0) {
    dataPoints++
    if (data.top10Ownership > 80) {
      score += 35
      reasons.push('Extreme holder concentration detected')
    } else if (data.top10Ownership > 60) {
      score += 20
      reasons.push('Top holders control majority of supply')
    }
  }

  // ── Liquidity
  if (data.liquidity > 0) {
    dataPoints++
    if (data.liquidity < 10_000) {
      score += 30
      reasons.push('Liquidity critically low')
    } else if (data.liquidity < 50_000) {
      score += 15
      reasons.push('Liquidity is dangerously low')
    }
  }

  // ── Volume/liquidity ratio
  if (data.volume24h > 0 && data.liquidity > 0) {
    dataPoints++
    if (data.volume24h > data.liquidity * 12) {
      score += 20
      reasons.push('Potential inorganic trading activity')
    } else if (data.volume24h > data.liquidity * 5) {
      score += 10
      reasons.push('Suspicious volume spike detected')
    }
  }

  // ── Token age
  if (data.ageMinutes > 0) {
    dataPoints++
    if (data.ageMinutes < 30) {
      score += 15
      reasons.push('Very recent token launch')
    } else if (data.ageMinutes < 120) {
      score += 8
      reasons.push('Token launched recently')
    }
  }

  const label = score <= 30 ? 'SAFE' : score <= 60 ? 'WATCH' : 'DANGER'

  // Confidence: based on data completeness + signal count
  const completeness = Math.min(dataPoints / 4, 1)
  const signalBoost = Math.min(reasons.length * 0.08, 0.2)
  const confidence = Math.round((0.55 + completeness * 0.3 + signalBoost) * 100)

  return { score, label, reasons, confidence }
}

export function getAgeMinutes(timestamp: number): number {
  if (!timestamp) return 0
  // Birdeye may return seconds (10-digit) or ms (13-digit)
  const ts = timestamp > 1e12 ? timestamp : timestamp * 1000
  return Math.max(0, Math.floor((Date.now() - ts) / 1000 / 60))
}