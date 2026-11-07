import { useState } from 'react'
import { formatCurrency } from '../../data/products'

function CheckoutForm({ cart, subtotal, shipping, total, onPlaceOrder, onContinueShopping }) {
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '' })
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')

  if (orderId) {
    return (
      <div className="checkout-success">
        <span className="checkout-success-mark">✓</span>
        <p className="eyebrow">Order confirmed</p>
        <h2>Thank you, {form.fullName}</h2>
        <p>Your order <strong>#{orderId}</strong> has been placed successfully. We&apos;ll send updates to your phone.</p>
        <button type="button" className="primary-button" onClick={onContinueShopping}>Continue shopping</button>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart checkout-empty">
        <h3>Your cart is empty</h3>
        <p>Add something beautiful before checking out.</p>
        <button type="button" className="primary-button" onClick={onContinueShopping}>Shop the collection</button>
      </div>
    )
  }

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'state', 'pincode']
    if (requiredFields.some((field) => !form[field].trim())) {
      setError('Please complete all delivery details.')
      return
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError('Please enter a valid 6-digit pincode.')
      return
    }

    const nextOrderId = `GT${Date.now().toString().slice(-8)}`
    onPlaceOrder({ id: nextOrderId, paymentMethod, delivery: form })
    setOrderId(nextOrderId)
  }

  return (
    <form className="checkout-layout" onSubmit={handleSubmit}>
      <div className="checkout-main">
        <div className="checkout-section">
          <div className="checkout-section-heading"><span>01</span><h2>Delivery details</h2></div>
          <div className="checkout-fields">
            <label>Full name<input value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} placeholder="Your full name" autoComplete="name" /></label>
            <label>Phone number<input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel" /></label>
            <label className="checkout-field-wide">Address<input value={form.address} onChange={(event) => updateField('address', event.target.value)} placeholder="House number, street, landmark" autoComplete="street-address" /></label>
            <label>City<input value={form.city} onChange={(event) => updateField('city', event.target.value)} placeholder="City" autoComplete="address-level2" /></label>
            <label>State<input value={form.state} onChange={(event) => updateField('state', event.target.value)} placeholder="State" autoComplete="address-level1" /></label>
            <label>Pincode<input value={form.pincode} onChange={(event) => updateField('pincode', event.target.value)} placeholder="6-digit pincode" inputMode="numeric" autoComplete="postal-code" /></label>
          </div>
        </div>

        <div className="checkout-section">
          <div className="checkout-section-heading"><span>02</span><h2>Payment method</h2></div>
          <div className="payment-options">
            {[
              ['upi', 'UPI', 'Pay securely using your UPI app'],
              ['card', 'Credit / Debit Card', 'Visa, Mastercard and RuPay'],
              ['cod', 'Cash on Delivery', 'Pay when your order arrives'],
            ].map(([value, title, description]) => (
              <label className={`payment-option ${paymentMethod === value ? 'selected' : ''}`} key={value}>
                <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={(event) => setPaymentMethod(event.target.value)} />
                <span><strong>{title}</strong><small>{description}</small></span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <aside className="checkout-summary">
        <h2>Order summary</h2>
        <div className="checkout-items">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color ?? ''}`}>
              <span>{item.name}{[item.size, item.color].filter(Boolean).map((variant) => ` · ${variant}`).join('')} × {item.quantity}</span>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
        <div className="summary-row"><span>Delivery</span><strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong></div>
        <div className="summary-row total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button type="submit" className="primary-button wide">Place order · {formatCurrency(total)}</button>
        <button type="button" className="checkout-back" onClick={onContinueShopping}>Continue shopping</button>
      </aside>
    </form>
  )
}

export default CheckoutForm
