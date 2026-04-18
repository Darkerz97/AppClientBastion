export function normalizeNotification(payload = {}) {
  return {
    id: payload.id ?? payload.notification_id ?? null,
    title: payload.title || 'Aviso Card Bastion',
    message: payload.message || payload.body || '',
    type: payload.type || payload.category || 'general',
    readAt: payload.read_at || payload.readAt || null,
    createdAt: payload.created_at || payload.date || null,
    actionLabel: payload.action_label || '',
    actionTo: payload.action_to || payload.link || '',
  }
}
