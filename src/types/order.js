/**
 * @typedef {Object} OrderItem
 * @property {string} name
 * @property {number} quantity
 * @property {number} total
 */

export function normalizeOrderItem(payload = {}) {
  return {
    name: payload.name || payload.product_name || payload.product?.name || 'Producto',
    quantity: Number(payload.quantity ?? payload.qty ?? 1) || 0,
    total: Number(payload.total ?? payload.subtotal ?? payload.line_total ?? 0) || 0,
  }
}

function normalizePayment(payload = {}) {
  return {
    method: payload.method || payload.payment_method || 'Por confirmar',
    amount: Number(payload.amount ?? payload.total ?? 0) || 0,
    status: payload.status || 'Aplicado',
    reference: payload.reference || payload.folio || '',
  }
}

export function normalizeOrder(payload = {}) {
  return {
    id: payload.id ?? payload.sale_id ?? payload.order_id ?? null,
    soldAt: payload.sold_at || payload.created_at || payload.date || null,
    total: Number(payload.total ?? payload.grand_total ?? payload.amount ?? 0) || 0,
    status: payload.status || payload.payment_status || payload.state || 'Completada',
    channel: payload.order_channel || payload.channel || 'storefront',
    paymentMethod: payload.payment_method || payload.method || '',
    rewardsGenerated: Number(payload.rewards_generated ?? payload.points_earned ?? 0) || 0,
    creditGenerated: Number(payload.credit_generated ?? 0) || 0,
    items: Array.isArray(payload.items) ? payload.items.map(normalizeOrderItem) : [],
    payments: Array.isArray(payload.payments) ? payload.payments.map(normalizePayment) : [],
  }
}

export function normalizeOrderDetail(payload = {}) {
  const base = normalizeOrder(payload)

  return {
    ...base,
    summary: payload.summary || '',
    invoiceNumber: payload.invoice_number || payload.folio || '',
  }
}
