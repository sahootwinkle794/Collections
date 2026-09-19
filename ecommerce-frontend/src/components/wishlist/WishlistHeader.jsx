function WishlistHeader({ onContinueShopping }) {
  return (
    <div className="wishlist-header-row">
      <div>
        <p className="eyebrow">Saved with intention</p>
        <h2>My wishlist</h2>
        <p className="wishlist-intro">Keep the pieces you love close until the right moment to bring them home.</p>
      </div>
      <button type="button" className="secondary-button" onClick={onContinueShopping}>Continue shopping</button>
    </div>
  )
}

export default WishlistHeader
