import { formatCurrency } from '../../data/products'

function ProductCard({ product, isFavorite, onToggleFavorite, onAddToCart, onViewDetails }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.badge && <span className="product-badge">{product.badge}</span>}

        <button
          className={`favorite-button ${isFavorite ? 'selected' : ''}`}
          onClick={() => onToggleFavorite(product.id)}
          type="button"
          aria-label={`Add ${product.name} to favorites`}
        >
          {isFavorite ? '♥' : '♡'}
        </button>

        <button className="quick-add" onClick={() => onAddToCart(product)} type="button">
          Quick add <span>+</span>
        </button>
      </div>

      <div className="product-info">
        <div>
          <h3>
            <button className="product-title" type="button" onClick={() => onViewDetails(product.id)}>
              {product.name}
            </button>
          </h3>
          <p>{product.category}</p>
        </div>
        <strong>{formatCurrency(product.price)}</strong>
      </div>

      <div className="rating">
        <span>★★★★★</span> {product.rating} <small>({product.reviews})</small>
      </div>

      <button className="view-details" type="button" onClick={() => onViewDetails(product.id)}>
        View details
      </button>
    </article>
  )
}

export default ProductCard
