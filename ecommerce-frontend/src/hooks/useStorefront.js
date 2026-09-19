import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { products } from '../data/products'

export function useStorefront() {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedProductId, setSelectedProductId] = useState(products[0].id)
  const [selectedSize, setSelectedSize] = useState(products[0].sizes[0])
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

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0]

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

  const addToCart = (product, size = product.sizes?.[0] ?? 'One size') => {
    setCart((current) => {
      const existingItem = current.find((item) => item.id === product.id && item.size === size)

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...current, { ...product, size, quantity: 1 }]
    })

    navigate('/cart')
  }

  const updateCartQuantity = (id, size, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id && item.size === size
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
    setSelectedSize(nextProduct?.sizes?.[0] ?? 'One size')
    navigate(`/product/${productId}`)
  }

  return {
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
    selectedSize,
    setSelectedSize,
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
