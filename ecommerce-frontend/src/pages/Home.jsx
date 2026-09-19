import HeroSection from '../components/home/HeroSection'
import ShopSection from '../components/home/ShopSection'
import ManifestoSection from '../components/home/ManifestoSection'
import Footer from '../components/layout/Footer'

function Home({ products, favorites, onToggleFavorite, onAddToCart, onViewDetails, onOpenCatalog, search, activeCategory, onCategoryChange }) {
  return (
    <>
      <HeroSection products={products} onOpenCatalog={onOpenCatalog} />
      <ShopSection
        products={products}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onAddToCart={onAddToCart}
        onViewDetails={onViewDetails}
        search={search}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
      <ManifestoSection onOpenCatalog={onOpenCatalog} />
      <Footer onOpenCatalog={onOpenCatalog} />
    </>
  )
}

export default Home
