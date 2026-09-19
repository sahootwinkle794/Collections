import ProductGrid from '../catalog/ProductGrid'

function ShopSection({ products, favorites, onToggleFavorite, onAddToCart, onViewDetails, search, activeCategory, onCategoryChange }) {
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="shop-section" id="shop">
      <div className="section-heading">
        <div><p className="eyebrow">Curated for you</p><h2>Shop the edit</h2></div>
        <p className="product-count">{filteredProducts.length} pieces</p>
      </div>
      <div className="shop-toolbar">
        <div className="category-tabs" role="tablist" aria-label="Product categories">
          {['All', 'Women', 'Men', 'Kids', 'Home', 'Accessories'].map((category) => (
            <button className={activeCategory === category ? 'active' : ''} onClick={() => onCategoryChange(category)} type="button" key={category}>
              {category}
            </button>
          ))}
        </div>
        <button className="sort-button" type="button">Sort: Featured <span>⌄</span></button>
      </div>
      <ProductGrid
        products={filteredProducts}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onAddToCart={onAddToCart}
        onViewDetails={onViewDetails}
      />
    </section>
  )
}

export default ShopSection
