import ProductCard from '../product/ProductCard'

function ProductGrid({ products, favorites, onToggleFavorite, onAddToCart, onViewDetails }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}

export default ProductGrid
