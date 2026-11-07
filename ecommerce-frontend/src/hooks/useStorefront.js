import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchCatalog } from '../api/catalog'

export function useStorefront() {
  const location = useLocation()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [catalogStatus, setCatalogStatus] = useState('loading')
  const [catalogError, setCatalogError] = useState('')
  const [catalogRetry, setCatalogRetry] = useState(0)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [orders, setOrders] = useState(() => {
    const savedOrders = window.localStorage.getItem('gt-orders')
    return savedOrders ? JSON.parse(savedOrders) : []
  })
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem('gt-user') ?? window.sessionStorage.getItem('gt-user')
    const parsedUser = savedUser ? JSON.parse(savedUser) : null
    return parsedUser?.fullName ? parsedUser : null
  })

  useEffect(() => {
    let isCurrentRequest = true

    fetchCatalog()
      .then((catalog) => {
        if (isCurrentRequest) {
          setProducts(catalog)
          setCatalogStatus('ready')
        }
      })
      .catch((error) => {
        if (isCurrentRequest) {
          setCatalogError(error.message)
          setCatalogStatus('error')
        }
      })

    return () => {
      isCurrentRequest = false
    }
  }, [catalogRetry])

  useEffect(() => {
    const refreshCatalogOnUserInteraction = () => {
      if (document.visibilityState === 'visible') {
        setCatalogError('')
        setCatalogStatus('loading')
        setCatalogRetry((current) => current + 1)
      }
    }

    window.addEventListener('focus', refreshCatalogOnUserInteraction)
    document.addEventListener('visibilitychange', refreshCatalogOnUserInteraction)

    return () => {
      window.removeEventListener('focus', refreshCatalogOnUserInteraction)
      document.removeEventListener('visibilitychange', refreshCatalogOnUserInteraction)
    }
  }, [])

  const categorySlug = location.pathname.startsWith('/category/')
    ? location.pathname.split('/')[2]
    : ''
  const categoryName = ['men', 'women', 'kids'].includes(categorySlug)
    ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
    : ''
  const orderId = location.pathname.startsWith('/orders/') ? location.pathname.split('/')[2] : ''

  const page = location.pathname === '/cart'
    ? 'cart'
    : location.pathname === '/wishlist'
      ? 'wishlist'
      : location.pathname === '/checkout'
        ? 'checkout'
        : location.pathname === '/orders'
          ? 'orders'
          : location.pathname === '/order-history'
            ? 'order-history'
          : orderId
            ? 'tracking'
      : location.pathname.startsWith('/product/')
        ? 'detail'
          : location.pathname === '/login'
            ? 'login'
        : categoryName
          ? 'category'
        : 'home'

  const setPage = (nextPage) => {
    const routes = {
      home: '/',
      wishlist: '/wishlist',
      cart: '/cart',
      checkout: '/checkout',
      orders: '/orders',
      'order-history': '/order-history',
      login: '/login',
    }

    navigate(routes[nextPage] ?? '/')
  }

  const openCategory = (category) => {
    navigate(`/category/${category.toLowerCase()}`)
  }

  const openTracking = (id) => navigate(`/orders/${id}`)

  const login = (credentials) => {
    const nextUser = { fullName: credentials.fullName, email: credentials.email }
    setUser(nextUser)
    window.localStorage.removeItem('gt-user')
    window.sessionStorage.removeItem('gt-user')
    const storage = credentials.rememberMe ? window.localStorage : window.sessionStorage
    storage.setItem('gt-user', JSON.stringify(nextUser))
    navigate('/')
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('gt-user')
    window.sessionStorage.removeItem('gt-user')
    navigate('/login')
  }

  const routeProductId = location.pathname.startsWith('/product/')
    ? Number(location.pathname.split('/')[2])
    : null
  const selectedProduct = products.find((product) => product.id === routeProductId)
    ?? products.find((product) => product.id === selectedProductId)
  const effectiveSelectedColor = selectedProduct?.colors?.includes(selectedColor)
    ? selectedColor
    : selectedProduct?.colors?.[0] ?? ''
  const matchingVariant = selectedProduct?.variants?.find(
    (variant) => variant.color === effectiveSelectedColor && variant.size === selectedSize,
  )
  const effectiveSelectedSize = matchingVariant?.size
    ?? selectedProduct?.variants?.find((variant) => variant.color === effectiveSelectedColor)?.size
    ?? selectedProduct?.sizes?.[0]
    ?? ''
  const retryCatalog = () => {
    setCatalogError('')
    setCatalogStatus('loading')
    setCatalogRetry((current) => current + 1)
  }

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart])
  const shipping = cart.length > 0 ? 12 : 0
  const total = subtotal + shipping

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favorite) => favorite !== id)
        : [...current, id],
    )
  }

  const addToCart = (product, size = product.sizes?.[0] ?? 'One size', color = product.colors?.[0] ?? '') => {
    const selectedVariantSize = size || product.sizes?.[0] || 'One size'
    const selectedVariantColor = color || product.colors?.[0] || ''
    const variant = product.variants?.find(
      (item) => item.size === selectedVariantSize && item.color === selectedVariantColor,
    ) ?? product.variants?.find((item) => item.size === selectedVariantSize)
    const cartSize = variant?.size ?? selectedVariantSize
    const cartColor = variant?.color ?? selectedVariantColor
    const price = variant?.price ?? product.price

    setCart((current) => {
      const existingItem = current.find((item) => (
        item.id === product.id && item.size === cartSize && item.color === cartColor
      ))

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id && item.size === cartSize && item.color === cartColor
            ? { ...item, price, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...current, { ...product, price, size: cartSize, color: cartColor, quantity: 1 }]
    })

    navigate('/cart')
  }

  const updateCartQuantity = (id, size, color, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id && item.size === size && item.color === color
            ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const placeOrder = (orderDetails) => {
    setOrders((current) => {
      const nextOrders = [{
        id: orderDetails.id,
        items: cart,
        subtotal,
        shipping,
        total,
        status: 'Delivered',
        createdAt: new Date().toISOString(),
      }, ...current]
      window.localStorage.setItem('gt-orders', JSON.stringify(nextOrders))
      return nextOrders
    })
    setCart([])
    navigate('/orders')
  }

  const handleDetailsClick = (productId) => {
    const nextProduct = products.find((product) => product.id === productId)
    setSelectedProductId(productId)
    setSelectedSize(nextProduct?.sizes?.[0] ?? '')
    setSelectedColor(nextProduct?.colors?.[0] ?? '')
    navigate(`/product/${productId}`)
  }

  const selectColor = (color) => {
    setSelectedColor(color)
    const matchingColorVariants = selectedProduct?.variants?.filter((variant) => variant.color === color) ?? []
    if (matchingColorVariants.length > 0 && !matchingColorVariants.some((variant) => variant.size === selectedSize)) {
      setSelectedSize(matchingColorVariants[0].size)
    }
  }

  return {
    products,
    catalogStatus,
    catalogError,
    retryCatalog,
    page,
    categoryName,
    user,
    orders,
    selectedOrder: orders.find((order) => order.id === orderId) ?? null,
    setPage,
    openCategory,
    openTracking,
    login,
    logout,
    selectedProduct,
    selectedSize: effectiveSelectedSize,
    setSelectedSize,
    selectedColor: effectiveSelectedColor,
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
  }
}
