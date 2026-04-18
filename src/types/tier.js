export function normalizeTier(payload = {}) {
  return {
    code: payload.code || payload.slug || 'bronze',
    name: payload.name || 'Bronce',
    level: Number(payload.level ?? 1) || 1,
    benefits: Array.isArray(payload.benefits) ? payload.benefits.filter(Boolean) : [],
    minPoints: Number(payload.min_points ?? payload.minPoints ?? 0) || 0,
    maxPoints: Number(payload.max_points ?? payload.maxPoints ?? 0) || 0,
    accentColor: payload.accent_color || '#c58a34',
  }
}

export function normalizeTierProgress(payload = {}) {
  return {
    currentTier: normalizeTier(payload.current_tier || payload.currentTier || payload.current || {}),
    nextTier: payload.next_tier || payload.nextTier ? normalizeTier(payload.next_tier || payload.nextTier) : null,
    progressPercentage: Number(payload.progress_percentage ?? payload.progress ?? 0) || 0,
    pointsToNextTier: Number(payload.points_to_next_tier ?? payload.remaining ?? 0) || 0,
    currentPoints: Number(payload.current_points ?? payload.points ?? 0) || 0,
    trackedMetricLabel: payload.tracked_metric_label || 'Puntos acumulados',
    history: Array.isArray(payload.history)
      ? payload.history.map((entry) => ({
          date: entry.date || entry.at || null,
          tierName: entry.tier_name || entry.name || 'Tier',
          points: Number(entry.points ?? 0) || 0,
        }))
      : [],
  }
}
