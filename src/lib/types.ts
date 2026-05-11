export type RiskLabel = 'SAFE' | 'WATCH' | 'DANGER'

export type ScanResult = {
  success: boolean
  cached?: boolean
  risk: {
    score: number
    label: RiskLabel
    reasons: string[]
    confidence: number
  }
  overview: {
    name: string
    symbol: string
    liquidity: number
    v24hUSD: number
    price: number | null
  }
  meta: {
    top10Ownership: number
    ageMinutes: number
    holdersAnalyzed: number
    scannedAt: number
  }
}

export const riskConfig: Record<RiskLabel, {
  color: string
  dimColor: string
  borderColor: string
}> = {
  SAFE: {
    color: '#00FF85',
    dimColor: 'rgba(0,255,133,0.07)',
    borderColor: 'rgba(0,255,133,0.22)',
  },
  WATCH: {
    color: '#FFB800',
    dimColor: 'rgba(255,184,0,0.07)',
    borderColor: 'rgba(255,184,0,0.22)',
  },
  DANGER: {
    color: '#FF3B3B',
    dimColor: 'rgba(255,59,59,0.07)',
    borderColor: 'rgba(255,59,59,0.22)',
  },
}