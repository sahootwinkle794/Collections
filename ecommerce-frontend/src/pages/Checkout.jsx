import CheckoutForm from '../components/checkout/CheckoutForm'

function Checkout({ cart, subtotal, shipping, total, onPlaceOrder, onContinueShopping }) {
  return (
    <section className="checkout-page">
      <div className="checkout-heading">
        <div>
          <p className="eyebrow">G&T Collections</p>
          <h1>Complete your order</h1>
          <p>Thoughtfully packed and delivered to your door.</p>
        </div>
        <span className="checkout-secure">Secure checkout</span>
      </div>
      <CheckoutForm
        cart={cart}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        onPlaceOrder={onPlaceOrder}
        onContinueShopping={onContinueShopping}
      />
    </section>
  )
}

export default Checkout
