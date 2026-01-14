// server/rules/evaluator.js

import { isWithinTimeWindow, isBullishEngulfing } from "./helpers.js";

export function evaluatePerfectSetup(tick, setupConfig, goldenRules) {
  const { conditions } = setupConfig;

  const issues = [];

  // 1. Time window
  if (!isWithinTimeWindow(tick.time, conditions.timeWindow)) {
    issues.push("Outside setup time window");
  }

  // 2. Trend direction (placeholder: you’ll feed trend from higher TF or rolling structure)
  if (conditions.trendDirection === "up" && tick.trend !== "up") {
    issues.push("Trend not aligned");
  }

  // 3. VWAP location
  if (conditions.aboveVWAP && !(tick.price > tick.vwap)) {
    issues.push("Price not above VWAP");
  }

  // 4. Volume spike
  if (tick.volumeAvg && tick.volume < tick.volumeAvg * conditions.minVolumeSpike) {
    issues.push("Volume not strong enough");
  }

  // 5. Candle pattern
  if (conditions.candleType === "bullish_engulf" && !isBullishEngulfing(tick.candle)) {
    issues.push("Candle not bullish engulfing");
  }

  const isPerfectSetup = issues.length === 0;

  return {
    isPerfectSetup,
    details: {
      issues,
      config: conditions,
    },
  };
}
