function ProductOptions({ product, selectedSize, onSelectSize }) {
  return (
    <>
      {product.colors && (
        <div className="option-group">
          <h3>Color</h3>
          <div className="choice-row">
            {product.colors.map((color) => <button type="button" key={color} className="choice-chip active">{color}</button>)}
          </div>
        </div>
      )}
      {product.sizes && product.sizes.length > 0 && (
        <div className="option-group">
          <h3>Size</h3>
          <div className="choice-row">
            {product.sizes.map((size) => (
              <button type="button" key={size} className={`choice-chip ${selectedSize === size ? 'selected' : ''}`} onClick={() => onSelectSize(size)}>
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ProductOptions
