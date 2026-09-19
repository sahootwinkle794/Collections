import { formatCurrency } from '../../data/products'

function CartItems({ cart, onUpdateQuantity }) {
  return (
    <div className="cart-items">
      {cart.map((item) => (
        <div className="cart-item" key={`${item.id}-${item.size}`}>
          <img src={item.image} alt={item.name} />
          <div className="cart-item-info">
            <div className="cart-item-row"><h3>{item.name}</h3><strong>{formatCurrency(item.price * item.quantity)}</strong></div>
            <p>{item.category} · {item.size}</p>
            <div className="quantity-row">
              <button type="button" onClick={() => onUpdateQuantity(item.id, item.size, -1)}>-</button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => onUpdateQuantity(item.id, item.size, 1)}>+</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartItems
