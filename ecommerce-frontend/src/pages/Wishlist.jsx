import WishlistHeader from '../components/wishlist/WishlistHeader'
import EmptyWishlist from '../components/wishlist/EmptyWishlist'
import WishlistGrid from '../components/wishlist/WishlistGrid'

function Wishlist({ products, favorites, onToggleFavorite, onAddToCart, onViewDetails, onContinueShopping }) {
  const savedProducts = products.filter((product) => favorites.includes(product.id))

  return (
    <section className="wishlist-page">
      <WishlistHeader onContinueShopping={onContinueShopping} />
      {savedProducts.length === 0 ? (
        <EmptyWishlist onContinueShopping={onContinueShopping} />
      ) : (
        <WishlistGrid
          products={savedProducts}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      )}
    </section>
  )
}

export default Wishlist
