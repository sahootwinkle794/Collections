import CategoryHeader from '../components/category/CategoryHeader'
import CategoryProducts from '../components/category/CategoryProducts'

function Category({ category, products, favorites, onToggleFavorite, onAddToCart, onViewDetails, onContinueShopping }) {
  return (
    <section className="category-page">
      <CategoryHeader category={category} onContinueShopping={onContinueShopping} />
      <CategoryProducts
        products={products}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onAddToCart={onAddToCart}
        onViewDetails={onViewDetails}
      />
    </section>
  )
}

export default Category
