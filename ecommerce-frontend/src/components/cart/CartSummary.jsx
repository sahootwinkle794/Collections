import { formatCurrency } from '../../data/products'

function CartSummary({ shipping, subtotal, total, onCheckout }) {
  return (
    <aside className="summary-card">
      <h3>Summary</h3>
      <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
      <div className="summary-row"><span>Shipping</span><strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong></div>
      <div className="summary-row total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
      <button type="button" className="primary-button wide" onClick={onCheckout}>Checkout</button>
    </aside>
  )
}

export default CartSummary
