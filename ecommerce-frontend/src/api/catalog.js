const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

async function getJson(path) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`)
  } catch (error) {
    throw new Error(`Could not connect to the catalog API: ${error.message}`, { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Catalog API request failed (${response.status} ${response.statusText}).`)
  }

  return response.json()
}

function normalizeRootCategory(name) {
  return name.replace(/\s+fashion$/i, '')
}

function indexCategories(categories) {
  const categoryById = new Map()

  const visit = (category, rootName = category.name) => {
    categoryById.set(category.id, {
      rootName: normalizeRootCategory(rootName),
      subcategory: category.name === rootName ? '' : category.name,
    })

    for (const child of category.subCategories ?? []) {
      visit(child, rootName)
    }
  }

  for (const category of categories) {
    visit(category)
  }

  return categoryById
}

function mapProduct(product, categoryById) {
  const variants = (product.variants ?? []).map((variant) => ({
    size: variant.size,
    color: variant.color,
    price: Number(variant.sellingPrice ?? variant.mrp),
    stockQuantity: variant.stockQuantity,
  })).filter((variant) => Number.isFinite(variant.price))

  const category = categoryById.get(product.categoryId)
  const images = product.images ?? []

  return {
    id: product.id,
    name: product.name,
    category: category?.rootName ?? product.categoryName ?? 'Collection',
    subcategory: category?.subcategory ?? product.categoryName ?? '',
    price: variants[0]?.price ?? 0,
    rating: null,
    reviews: null,
    badge: '',
    image: images.find((image) => image.primary)?.imageUrl ?? images[0]?.imageUrl ?? '',
    description: product.description ?? '',
    details: [product.fabric, product.sleeveLength, product.pattern].filter(Boolean).join(' · '),
    colors: [...new Set(variants.map((variant) => variant.color).filter(Boolean))],
    sizes: [...new Set(variants.map((variant) => variant.size).filter(Boolean))],
    variants,
  }
}

export async function fetchCatalog() {
  const [products, categories] = await Promise.all([
    getJson('/products'),
    getJson('/categories'),
  ])

  if (!Array.isArray(products) || !Array.isArray(categories)) {
    throw new Error('The catalog API returned an unexpected response.')
  }

  const categoryById = indexCategories(categories)
  return products
    .filter((product) => product.active !== false)
    .map((product) => mapProduct(product, categoryById))
}
