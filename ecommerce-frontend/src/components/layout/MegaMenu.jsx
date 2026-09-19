const menuGroups = {
  Men: [
    { title: 'Indian & Fusion Wear', items: ['Kurtas & Sets', 'Nehru Jackets', 'Sherwanis', 'Festive Wear'] },
    { title: 'Western Wear', items: ['Shirts', 'T-shirts', 'Jeans', 'Trousers'] },
    { title: 'Footwear', items: ['Juttis', 'Casual Shoes', 'Sandals'] },
    { title: 'Accessories', items: ['Watches', 'Wallets', 'Sunglasses'] },
  ],
  Women: [
    { title: 'Indian & Fusion Wear', items: ['Kurtas & Sets', 'Sarees', 'Ethnic Wear', 'Dupattas & Shawls'] },
    { title: 'Western Wear', items: ['Dresses', 'Tops', 'Co-ords', 'Jumpsuits'] },
    { title: 'Footwear', items: ['Juttis', 'Flats', 'Sandals', 'Heels'] },
    { title: 'Accessories', items: ['Jewellery', 'Potli Bags', 'Scarves', 'Hair Accessories'] },
  ],
  Kids: [
    { title: 'Girls', items: ['Ethnic Sets', 'Lehengas', 'Dresses', 'Tops & Tees'] },
    { title: 'Boys', items: ['Kurta Sets', 'Nehru Jackets', 'Shirts', 'T-shirts'] },
    { title: 'Footwear', items: ['Juttis', 'Sandals', 'Casual Shoes'] },
    { title: 'Accessories', items: ['Hair Bows', 'Bags', 'Caps', 'Socks'] },
  ],
}

function MegaMenu({ category, onSelectCategory }) {
  const groups = menuGroups[category] ?? []

  return (
    <div className="mega-menu" role="menu" aria-label={`${category} categories`}>
      <div className="mega-menu-inner">
        <div className="mega-menu-intro">
          <span className="mega-menu-kicker">G&T Collections</span>
          <strong>{category}&apos;s edit</strong>
          <button type="button" onClick={() => onSelectCategory(category)}>Shop all {category}</button>
        </div>
        <div className="mega-menu-groups">
          {groups.map((group) => (
            <div className="mega-menu-group" key={group.title}>
              <h3>{group.title}</h3>
              {group.items.map((item) => (
                <button type="button" key={item} onClick={() => onSelectCategory(category)}>
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MegaMenu
