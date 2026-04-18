function normalizePreorderItem(payload = {}) {
  return {
    id: payload.id ?? payload.product_id ?? null,
    name: payload.name || payload.product_name || payload.product?.name || 'Articulo',
    quantity: Number(payload.quantity ?? payload.qty ?? 1) || 0,
    unitPrice: Number(payload.unit_price ?? payload.price ?? 0) || 0,
    total: Number(payload.total ?? payload.line_total ?? payload.subtotal ?? 0) || 0,
  }
}

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
  const items = Array.isArray(payload.items) ? payload.items.map(normalizePreorderItem) : []

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
    deliveryDate: payload.delivery_date || payload.available_at || null,
    createdAt: payload.created_at || payload.date || null,
    updatedAt: payload.updated_at || null,
    items,
    alerts: Array.isArray(payload.alerts) ? payload.alerts.filter(Boolean) : [],
    paymentProgress: Number(payload.payment_progress ?? 0) || 0,
  }
}

export function normalizePreorderDetail(payload = {}) {
  const base = normalizePreorder(payload)

  return {
    ...base,
    notes: payload.notes || payload.description || '',
    pickupLocation: payload.pickup_location || payload.location || 'Card Bastion',
    statusLabel: payload.status_label || base.status,
  }
}
