function CartHeader({ cartCount, onContinueShopping }) {
  return (
    <div className="cart-header-row">
      <div><p className="eyebrow">Your bag</p><h2>{cartCount} item{cartCount === 1 ? '' : 's'}</h2></div>
      <button type="button" className="secondary-button" onClick={onContinueShopping}>Continue shopping</button>
    </div>
  )
}

export default CartHeader
