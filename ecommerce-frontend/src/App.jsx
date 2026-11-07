import { useEffect } from 'react'
import './App.css'
import AnnouncementBar from './components/layout/AnnouncementBar'
import Header from './components/layout/Header'
import Home from './pages/Home'
import Wishlist from './pages/Wishlist'
import Category from './pages/Category'
import Login from './pages/Login'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Tracking from './pages/Tracking'
import OrderHistory from './pages/OrderHistory'
import { useStorefront } from './hooks/useStorefront'

function CatalogStatus({ status, error, onRetry }) {
  return (
    <section className="catalog-status" role={status === 'error' ? 'alert' : 'status'}>
      {status === 'loading' ? (
        <p>Loading the collection…</p>
      ) : (
        <>
          <p>We couldn&apos;t load the collection. {error}</p>
          <button type="button" className="primary-button" onClick={onRetry}>Try again</button>
        </>
      )}
    </section>
  )
}

function App() {
  const {
    products,
    catalogStatus,
    catalogError,
    retryCatalog,
    page,
    categoryName,
    user,
    orders,
    selectedOrder,
    setPage,
    openCategory,
    login,
    logout,
    selectedProduct,
    selectedSize,
    setSelectedSize,
    selectedColor,
    selectColor,
    activeCategory,
    setActiveCategory,
    search,
    setSearch,
    cart,
    favorites,
    cartCount,
    subtotal,
    shipping,
    total,
    toggleFavorite,
    addToCart,
    updateCartQuantity,
    placeOrder,
    handleDetailsClick,
  } = useStorefront()

  useEffect(() => {
    const pageTitles = {
      home: 'Home',
      wishlist: 'Wishlist',
      cart: 'Cart',
      checkout: 'Checkout',
      orders: 'My Orders',
      'order-history': 'Order History',
      tracking: 'Track Order',
      detail: 'Product Details',
      login: 'Login',
    }

    const title = page === 'category' ? `${categoryName} Collection` : pageTitles[page] ?? 'Home'
    document.title = `${title} | G&T Collections`
  }, [page, categoryName])

  return (
    <main className="storefront">
      <AnnouncementBar />
      <Header
        search={search}
        onSearchChange={setSearch}
        cartCount={cartCount}
        favoriteCount={favorites.length}
        onOpenCart={() => setPage('cart')}
        onOpenWishlist={() => setPage('wishlist')}
        onOpenLogin={() => setPage('login')}
        onLogout={logout}
        onOpenOrders={() => setPage('orders')}
        onOpenOrderHistory={() => setPage('order-history')}
        user={user}
        onOpenCatalog={() => setPage('home')}
        onOpenCategory={openCategory}
      />

      {page === 'home' && (
        catalogStatus === 'ready' ? (
          <Home
            products={products}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onAddToCart={addToCart}
            onViewDetails={handleDetailsClick}
            onOpenCatalog={() => setPage('home')}
            search={search}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        ) : <CatalogStatus status={catalogStatus} error={catalogError} onRetry={retryCatalog} />
      )}

      {page === 'login' && (
        <Login user={user} onLogin={login} onLogout={logout} />
      )}

      {page === 'detail' && (
        catalogStatus !== 'ready' ? (
          <CatalogStatus status={catalogStatus} error={catalogError} onRetry={retryCatalog} />
        ) : selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            isFavorite={favorites.includes(selectedProduct.id)}
            onToggleFavorite={toggleFavorite}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSelectSize={setSelectedSize}
            onSelectColor={selectColor}
            onAddToCart={addToCart}
            onBack={() => setPage('home')}
          />
        ) : <p className="catalog-status">This product could not be found.</p>
      )}

      {page === 'wishlist' && (
        catalogStatus === 'ready' ? (
          <Wishlist
            products={products}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onAddToCart={addToCart}
            onViewDetails={handleDetailsClick}
            onContinueShopping={() => setPage('home')}
          />
        ) : <CatalogStatus status={catalogStatus} error={catalogError} onRetry={retryCatalog} />
      )}

      {page === 'category' && (
        catalogStatus === 'ready' ? (
          <Category
            category={categoryName}
            products={products.filter((product) => product.category.toLowerCase() === categoryName.toLowerCase())}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onAddToCart={addToCart}
            onViewDetails={handleDetailsClick}
            onContinueShopping={() => setPage('home')}
          />
        ) : <CatalogStatus status={catalogStatus} error={catalogError} onRetry={retryCatalog} />
      )}

      {page === 'cart' && (
        <CartPage
          cart={cart}
          onUpdateQuantity={updateCartQuantity}
          onContinueShopping={() => setPage('home')}
          onCheckout={() => setPage('checkout')}
          shipping={shipping}
          subtotal={subtotal}
          total={total}
        />
      )}

      {page === 'checkout' && (
        <Checkout
          cart={cart}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onPlaceOrder={placeOrder}
          onContinueShopping={() => setPage('home')}
        />
      )}

      {page === 'orders' && <Orders orders={orders} onOpenHistory={() => setPage('order-history')} onContinueShopping={() => setPage('home')} />}
      {page === 'order-history' && <OrderHistory orders={orders} onViewDetails={handleDetailsClick} onContinueShopping={() => setPage('home')} />}
      {page === 'tracking' && <Tracking order={selectedOrder} onBackToOrders={() => setPage('orders')} onContinueShopping={() => setPage('home')} />}
    </main>
  )
}

export default App
