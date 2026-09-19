import ProductGrid from '../catalog/ProductGrid'

function WishlistGrid({ products, favorites, onToggleFavorite, onAddToCart, onViewDetails }) {
  return (
    <>
      <div className="wishlist-meta">
        <span>{products.length} saved piece{products.length === 1 ? '' : 's'}</span>
        <span>Curated by you</span>
      </div>
      <ProductGrid
        products={products}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onAddToCart={onAddToCart}
        onViewDetails={onViewDetails}
      />
    </>
  )
}

export default WishlistGrid
