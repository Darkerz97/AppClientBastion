export function normalizeRewardSummary(payload = {}) {
  return {
    pointsBalance: Number(payload.points_balance ?? payload.points ?? 0) || 0,
    creditBalance: Number(payload.credit_balance ?? payload.credit ?? 0) || 0,
    rewardBalance: Number(payload.reward_balance ?? payload.rewards ?? 0) || 0,
    expiringPoints: Number(payload.expiring_points ?? 0) || 0,
    expiringAt: payload.expiring_at || null,
  }
}

export function normalizeRewardMovement(payload = {}) {
  return {
    id: payload.id ?? payload.movement_id ?? null,
    origin: payload.origin || payload.type || 'ajuste',
    label: payload.label || payload.description || 'Movimiento de recompensa',
    points: Number(payload.points ?? payload.points_delta ?? 0) || 0,
    credit: Number(payload.credit ?? payload.credit_delta ?? 0) || 0,
    amount: Number(payload.amount ?? 0) || 0,
    status: payload.status || 'aplicado',
    occurredAt: payload.occurred_at || payload.created_at || payload.date || null,
    expiresAt: payload.expires_at || payload.expiration_date || null,
    description: payload.description || payload.notes || '',
  }
}
