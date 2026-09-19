function ProductGallery({ product }) {
  return (
    <div className="detail-gallery">
      <img src={product.image} alt={product.name} />
    </div>
  )
}

export default ProductGallery
