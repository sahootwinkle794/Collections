function EmptyCart({ onContinueShopping }) {
  return (
    <div className="empty-cart">
      <h3>Your bag is empty</h3>
      <p>Add a few favorites from the collection and come back here.</p>
      <button type="button" className="primary-button large" onClick={onContinueShopping}>Shop the collection</button>
    </div>
  )
}

export default EmptyCart
