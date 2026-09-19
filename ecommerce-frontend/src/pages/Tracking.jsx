import { formatCurrency } from '../data/products'

function Tracking({ order, onBackToOrders, onContinueShopping }) {
  if (!order) return <section className="orders-page"><div className="empty-cart orders-empty"><h3>Order not found</h3><button type="button" className="primary-button" onClick={onBackToOrders}>View orders</button></div></section>

  return (
    <section className="tracking-page">
      <div className="tracking-heading"><div><p className="eyebrow">Delivery tracking</p><h1>Order #{order.id}</h1><p>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div><button type="button" className="secondary-button" onClick={onBackToOrders}>All orders</button></div>
      <div className="tracking-layout"><div className="tracking-card"><div className="tracking-progress delivered"><span className="tracking-line" />{['Confirmed', 'Preparing', 'On the way', 'Delivered'].map((step) => <div className="tracking-step complete" key={step}><b>✓</b><strong>{step}</strong><small>Complete</small></div>)}</div><div className="delivery-box"><span>Delivering to</span><strong>{order.delivery.fullName}</strong><p>{order.delivery.address}, {order.delivery.city}, {order.delivery.state} - {order.delivery.pincode}</p></div></div><aside className="tracking-summary"><h2>Order details</h2>{order.items.map((item) => <div className="tracking-item" key={`${item.id}-${item.size}`}><span>{item.name} × {item.quantity}</span><strong>{formatCurrency(item.price * item.quantity)}</strong></div>)}<div className="summary-row total"><span>Total</span><strong>{formatCurrency(order.total)}</strong></div><button type="button" className="primary-button wide" onClick={onContinueShopping}>Continue shopping</button></aside></div>
    </section>
  )
}

export default Tracking
