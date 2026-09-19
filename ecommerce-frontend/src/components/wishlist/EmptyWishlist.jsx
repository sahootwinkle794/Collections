function EmptyWishlist({ onContinueShopping }) {
  return (
    <div className="empty-wishlist">
      <span className="empty-wishlist-mark">♡</span>
      <h3>Your wishlist is waiting</h3>
      <p>Tap the heart on anything that feels like you, and it will appear here.</p>
      <button type="button" className="primary-button large" onClick={onContinueShopping}>Explore the collection</button>
    </div>
  )
}

export default EmptyWishlist
