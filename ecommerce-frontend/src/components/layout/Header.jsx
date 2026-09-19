import brandLogo from '../../assets/G&T.png'
import { useState } from 'react'
import MegaMenu from './MegaMenu'

function Header({ search, onSearchChange, cartCount, favoriteCount, user, onOpenCart, onOpenWishlist, onOpenLogin, onLogout, onOpenOrders, onOpenOrderHistory, onOpenCatalog, onOpenCategory }) {
  const [openMenu, setOpenMenu] = useState(null)

  const selectCategory = (category) => {
    setOpenMenu(null)
    onOpenCategory(category)
  }

  return (
    <header className="site-header">
      <button className="mobile-menu" type="button" aria-label="Open menu">
        ☰
      </button>
      <button className="brand" type="button" onClick={onOpenCatalog} aria-label="G&T Collections home">
        <img src={brandLogo} alt="G&T Collections logo" className="brand-logo" />
      </button>

      <nav className="main-nav" aria-label="Main navigation">
        {['Men', 'Women', 'Kids'].map((category) => (
          <div className="mega-menu-trigger" key={category} onMouseEnter={() => setOpenMenu(category)}>
            <button
              type="button"
              className={openMenu === category ? 'active' : ''}
              onClick={() => selectCategory(category)}
              aria-expanded={openMenu === category}
            >
              {category}
            </button>
          </div>
        ))}
      </nav>

      {openMenu && (
        <div className="mega-menu-hover-zone" onMouseLeave={() => setOpenMenu(null)}>
          <MegaMenu category={openMenu} onSelectCategory={selectCategory} />
        </div>
      )}

      <div className="header-actions">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search pieces"
            aria-label="Search products"
          />
        </label>

        <div className="profile-menu-wrap">
          <button className="header-icon-action profile-icon-action" type="button" onClick={onOpenLogin} aria-label={user ? 'Open profile' : 'Log in'}>
            <span className="header-action-icon">
              <svg className="profile-svg" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            </span>
            <small>{user ? 'Profile' : 'Login'}</small>
          </button>
          {user && (
            <div className="profile-dropdown">
              <div className="profile-summary">
                <span className="profile-avatar" aria-hidden="true">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <strong>Hello {user.fullName}</strong>
                </div>
              </div>
              <button type="button" onClick={onOpenOrders}>
                <svg className="profile-menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 8h14v12H5z" />
                  <path d="M8 8V6a4 4 0 0 1 8 0v2" />
                  <path d="M9 12h6" />
                </svg>
                My Orders
              </button>
              <button type="button" onClick={onOpenOrderHistory}>
                <svg className="profile-menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 3h9l3 3v15H6z" />
                  <path d="M15 3v4h4M9 11h6M9 15h6M9 19h4" />
                </svg>
                Order History
              </button>
              <button type="button" onClick={onLogout}><span>×</span> Delete Account</button>
              <button type="button" onClick={onLogout}><span>↪</span> Logout</button>
            </div>
          )}
        </div>

        <button className="header-icon-action wishlist-icon-action" type="button" onClick={onOpenWishlist} aria-label="View wishlist">
          <span className="header-action-icon">♡{favoriteCount > 0 && <sup>{favoriteCount}</sup>}</span>
          <small>Wishlist</small>
        </button>

        <button className="header-icon-action cart-icon-action" type="button" onClick={onOpenCart} aria-label={`${cartCount} items in cart`}>
          <span className="header-action-icon">
            <svg className="cart-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
              <circle cx="10" cy="20" r="1.2" />
              <circle cx="18" cy="20" r="1.2" />
            </svg>
            <sup>{cartCount}</sup>
          </span>
          <small>Cart</small>
        </button>
      </div>
    </header>
  )
}

export default Header
