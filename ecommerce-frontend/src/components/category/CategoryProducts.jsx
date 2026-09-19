import ProductGrid from '../catalog/ProductGrid'

function CategoryProducts({ products, favorites, onToggleFavorite, onAddToCart, onViewDetails }) {
  return (
    <section className="category-products">
      <div className="category-products-heading">
        <h2>Shop the collection</h2>
        <span>{products.length} pieces</span>
      </div>
      {products.length > 0 ? (
        <ProductGrid
          products={products}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ) : (
        <div className="empty-category"><p>New pieces for this edit are arriving soon.</p></div>
      )}
    </section>
  )
}

export default CategoryProducts
