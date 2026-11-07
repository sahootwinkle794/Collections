import { formatCurrency } from '../../data/products'

function ProductActions({ product, selectedSize, selectedColor, onAddToCart, onBack }) {
  const selectedVariant = product.variants?.find(
    (variant) => variant.size === selectedSize && variant.color === selectedColor,
  )
  const price = selectedVariant?.price ?? product.price

  return (
    <div className="detail-actions">
      <button className="primary-button large" type="button" onClick={() => onAddToCart(product, selectedSize, selectedColor)}>
        Add to bag · {formatCurrency(price)}
      </button>
      <button className="secondary-button" type="button" onClick={onBack}>Continue shopping</button>
    </div>
  )
}

export default ProductActions
