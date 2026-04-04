/**
 * @typedef {Object} Preorder
 * @property {string|number|null} id
 * @property {string} title
 * @property {number} total
 * @property {number} paid
 * @property {number} pending
 * @property {string} status
 * @property {string} deliveryStatus
 * @property {string|null} createdAt
 * @property {Array} items
 */

export function normalizePreorder(payload = {}) {
  return {
    id: payload.id ?? payload.preorder_id ?? null,
    title:
      payload.title ||
      payload.name ||
      payload.product_name ||
      payload.product?.name ||
      'Preventa Card Bastion',
    total: Number(payload.total ?? payload.total_amount ?? payload.amount ?? 0) || 0,
    paid: Number(payload.paid ?? payload.paid_amount ?? payload.abonado ?? 0) || 0,
    pending: Number(payload.pending ?? payload.pending_amount ?? payload.restante ?? 0) || 0,
    status: payload.status || payload.payment_status || payload.state || 'Pendiente',
    deliveryStatus: payload.delivery_status || payload.deliveryStatus || 'Por confirmar',
    createdAt: payload.created_at || payload.date || null,
    items: Array.isArray(payload.items) ? payload.items : [],
  }
}
