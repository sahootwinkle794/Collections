import { formatCurrency } from '../../data/products'

function ProductActions({ product, selectedSize, onAddToCart, onBack }) {
  return (
    <div className="detail-actions">
      <button className="primary-button large" type="button" onClick={() => onAddToCart(product, selectedSize)}>
        Add to bag · {formatCurrency(product.price)}
      </button>
      <button className="secondary-button" type="button" onClick={onBack}>Continue shopping</button>
    </div>
  )
}

export default ProductActions
