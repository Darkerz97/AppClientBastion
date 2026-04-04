/**
 * @typedef {Object} OrderItem
 * @property {string} name
 * @property {number} quantity
 * @property {number} total
 */

/**
 * @typedef {Object} Order
 * @property {string|number|null} id
 * @property {string|null} soldAt
 * @property {number} total
 * @property {string} status
 * @property {string} channel
 * @property {OrderItem[]} items
 * @property {Array} payments
 */

export function normalizeOrderItem(payload = {}) {
  return {
    name: payload.name || payload.product_name || payload.product?.name || 'Producto',
    quantity: Number(payload.quantity ?? payload.qty ?? 1) || 0,
    total: Number(payload.total ?? payload.subtotal ?? payload.line_total ?? 0) || 0,
  }
}

export function normalizeOrder(payload = {}) {
  return {
    id: payload.id ?? payload.sale_id ?? payload.order_id ?? null,
    soldAt: payload.sold_at || payload.created_at || payload.date || null,
    total: Number(payload.total ?? payload.grand_total ?? payload.amount ?? 0) || 0,
    status: payload.status || payload.payment_status || payload.state || 'Completada',
    channel: payload.order_channel || payload.channel || 'storefront',
    items: Array.isArray(payload.items) ? payload.items.map(normalizeOrderItem) : [],
    payments: Array.isArray(payload.payments) ? payload.payments : [],
  }
}
