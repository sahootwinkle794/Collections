function ProductOptions({ product, selectedSize, selectedColor, onSelectSize, onSelectColor }) {
  const availableSizes = product.variants
    ?.filter((variant) => variant.color === selectedColor)
    .map((variant) => variant.size)
    .filter((size, index, sizes) => size && sizes.indexOf(size) === index)
  const sizes = availableSizes?.length ? availableSizes : product.sizes

  return (
    <>
      {product.colors?.length > 0 && (
        <div className="option-group">
          <h3>Color</h3>
          <div className="choice-row">
            {product.colors.map((color) => (
              <button
                type="button"
                key={color}
                className={`choice-chip ${selectedColor === color ? 'selected' : ''}`}
                onClick={() => onSelectColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
      {sizes && sizes.length > 0 && (
        <div className="option-group">
          <h3>Size</h3>
          <div className="choice-row">
            {sizes.map((size) => (
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
