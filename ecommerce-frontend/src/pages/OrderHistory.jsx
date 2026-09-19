import { formatCurrency } from '../data/products'
import OrderProductCard from '../components/orders/OrderProductCard'

function OrderHistory({ orders, onViewDetails, onContinueShopping }) {
  return (
    <section className="orders-page">
      <div className="orders-heading"><div><p className="eyebrow">Your account</p><h1>Order history</h1><p>Browse every order you have placed with G&T Collections.</p></div><button type="button" className="secondary-button" onClick={onContinueShopping}>Continue shopping</button></div>
      {orders.length === 0 ? <div className="empty-cart orders-empty"><h3>No order history yet</h3><p>Your completed orders will appear here.</p><button type="button" className="primary-button" onClick={onContinueShopping}>Start shopping</button></div> : <div className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-card-top"><div><span className="order-label">Order #{order.id}</span><h2>{order.items.length} item{order.items.length === 1 ? '' : 's'}</h2></div><span className="order-status">{order.status}</span></div><div className="order-card-details"><span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span><strong>{formatCurrency(order.total)}</strong></div><div className="order-products">{order.items.map((item) => <OrderProductCard key={`${order.id}-${item.id}-${item.size}`} item={item} onViewDetails={onViewDetails} />)}</div></article>)}</div>}
    </section>
  )
}

export default OrderHistory
