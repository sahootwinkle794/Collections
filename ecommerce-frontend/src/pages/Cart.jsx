import CartHeader from '../components/cart/CartHeader'
import EmptyCart from '../components/cart/EmptyCart'
import CartItems from '../components/cart/CartItems'
import CartSummary from '../components/cart/CartSummary'

function Cart({ cart, onUpdateQuantity, onContinueShopping, onCheckout, shipping, subtotal, total }) {
  const cartCount = cart.reduce((totalItems, item) => totalItems + item.quantity, 0)

  return (
    <section className="cart-page">
      <CartHeader cartCount={cartCount} onContinueShopping={onContinueShopping} />
      {cart.length === 0 ? (
        <EmptyCart onContinueShopping={onContinueShopping} />
      ) : (
        <div className="cart-layout">
          <CartItems cart={cart} onUpdateQuantity={onUpdateQuantity} />
          <CartSummary shipping={shipping} subtotal={subtotal} total={total} onCheckout={onCheckout} />
        </div>
      )}
    </section>
  )
}

export default Cart
