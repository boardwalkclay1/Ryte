// rules/config.js

export const PERFECT_SETUP = {
  name: "A-Setup Trend Continuation",
  timeframe: "1m",
  conditions: {
    trendDirection: "up",          // HH/HL
    aboveVWAP: true,
    minVolumeSpike: 1.5,           // 1.5x average
    candleType: "bullish_engulf",
    timeWindow: { start: "09:45", end: "11:30" },
    maxSpread: 0.05,               // 5% max spread
  },
};

export const GOLDEN_RULES = {
  maxTradesPerDay: 3,
  noTradingAfter: "15:30",
  noChasing: {
    maxDistanceFromEntryZone: 0.3, // 0.3% beyond planned zone
  },
  noRevengeTradeCooldownMinutes: 15,
};
