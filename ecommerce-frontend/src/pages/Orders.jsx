import { formatCurrency } from '../data/products'

function Orders({ orders, onOpenHistory, onContinueShopping }) {
  return (
    <section className="orders-page">
      <div className="orders-heading"><div><p className="eyebrow">Your account</p><h1>My orders</h1><p>Review your purchases and follow every delivery.</p></div><button type="button" className="secondary-button" onClick={onContinueShopping}>Continue shopping</button></div>
      {orders.length === 0 ? (
        <div className="empty-cart orders-empty"><h3>No orders yet</h3><p>Your confirmed orders will appear here.</p><button type="button" className="primary-button" onClick={onContinueShopping}>Start shopping</button></div>
      ) : (
        <div className="orders-list">{orders.slice(0, 1).map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card-top"><div><span className="order-label">Latest order #{order.id}</span><h2>{order.status}</h2></div><span className="order-status">{order.status}</span></div>
            <div className="order-card-details"><span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span><strong>{formatCurrency(order.total)}</strong></div>
            <p className="orders-overview-copy">Your latest order has been delivered successfully.</p>
            <button type="button" className="primary-button" onClick={onOpenHistory}>View order history</button>
          </article>
        ))}</div>
      )}
    </section>
  )
}

export default Orders
