const categoryHighlights = {
  Men: ['Kurtas & Sets', 'Nehru Jackets', 'Footwear', 'Accessories'],
  Women: ['Kurtas & Sets', 'Sarees', 'Fusion Wear', 'Accessories'],
  Kids: ['Girls Ethnic', 'Boys Kurta Sets', 'Festive Wear', 'Footwear'],
}

function CategoryHeader({ category, onContinueShopping }) {
  return (
    <>
      <div className="category-page-header">
        <div>
          <p className="eyebrow">The {category} edit</p>
          <h1>{category}&apos;s ethnic collection</h1>
          <p>Indian craft, considered silhouettes, and festive details made for every celebration.</p>
        </div>
        <button type="button" className="secondary-button" onClick={onContinueShopping}>View all products</button>
      </div>
      <div className="category-highlights" aria-label={`${category} categories`}>
        {categoryHighlights[category].map((highlight) => <span key={highlight}>{highlight}</span>)}
      </div>
    </>
  )
}

export default CategoryHeader
