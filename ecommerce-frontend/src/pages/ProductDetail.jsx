import { formatCurrency } from '../data/products'
import ProductGallery from '../components/product/ProductGallery'
import ProductOptions from '../components/product/ProductOptions'
import ProductActions from '../components/product/ProductActions'
import ProductFeatures from '../components/product/ProductFeatures'

function ProductDetail({ product, isFavorite, onToggleFavorite, selectedSize, selectedColor, onSelectSize, onSelectColor, onAddToCart, onBack }) {
  const selectedVariant = product.variants?.find(
    (variant) => variant.size === selectedSize && variant.color === selectedColor,
  )

  return (
    <section className="detail-page">
      <div className="detail-breadcrumbs">
        <button type="button" onClick={onBack}>Catalog</button>
        <span>/</span>
        <span>{product.category}</span>
      </div>
      <div className="detail-layout">
        <ProductGallery product={product} />
        <div className="detail-content">
          <p className="eyebrow">{product.category}</p>
          <h2>{product.name}</h2>
          <div className="detail-price-row">
            <strong>{formatCurrency(selectedVariant?.price ?? product.price)}</strong>
            {product.rating != null && <span>★ {product.rating} {product.reviews != null && `(${product.reviews} reviews)`}</span>}
            <button
              type="button"
              className={`detail-wishlist ${isFavorite ? 'selected' : ''}`}
              onClick={() => onToggleFavorite(product.id)}
              aria-label={isFavorite ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
          </div>
          <p className="detail-description">{product.description}</p>
          <ProductOptions
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSelectSize={onSelectSize}
            onSelectColor={onSelectColor}
          />
          <ProductActions product={product} selectedSize={selectedSize} selectedColor={selectedColor} onAddToCart={onAddToCart} onBack={onBack} />
          <ProductFeatures details={product.details} />
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
