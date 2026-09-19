import { formatCurrency } from '../../data/products'

function OrderProductCard({ item, onViewDetails }) {
  return (
    <article className="order-product-card">
      <img src={item.image} alt={item.name} />
      <div className="order-product-info">
        <div><h3>{item.name}</h3><p>{item.category} · {item.size} · Qty {item.quantity}</p></div>
        <strong>{formatCurrency(item.price * item.quantity)}</strong>
        <button type="button" className="view-details" onClick={() => onViewDetails(item.id)}>View product details</button>
      </div>
    </article>
  )
}

export default OrderProductCard
