import { useEffect, useState } from 'react'

function HeroSection({ products, onOpenCatalog }) {
  const slides = [
    {
      eyebrow: 'G&T Collections',
      title: 'Style in every',
      accent: 'thread.',
      description: 'Thoughtful pieces for elevated everyday living, crafted to feel personal and effortless.',
      buttonText: 'Shop the collection',
      image: products[0]?.image,
      note: 'Curated for modern rituals',
    },
    {
      eyebrow: 'New in',
      title: 'Layered living',
      accent: 'for slow mornings.',
      description: 'Soft silhouettes, statement essentials, and tactile pieces that turn everyday rituals into something special.',
      buttonText: 'Explore new arrivals',
      image: products[1]?.image,
      note: 'New essentials in warm tones',
    },
    {
      eyebrow: 'The edit',
      title: 'Minimal forms,',
      accent: 'rich textures.',
      description: 'Build a wardrobe and home that feels considered, intentional, and deeply personal from the first glance.',
      buttonText: 'Discover the edit',
      image: products[2]?.image,
      note: 'Find your daily uniform',
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const activeSlide = slides[currentSlide]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  return (
    <section className="hero-banner" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{activeSlide.eyebrow}</p>
        <h1>
          {activeSlide.title}
          <br />
          <em>{activeSlide.accent}</em>
        </h1>
        <p className="hero-description">{activeSlide.description}</p>
        <div className="hero-actions">
          <button type="button" className="primary-button" onClick={onOpenCatalog}>
            {activeSlide.buttonText} <span>↗</span>
          </button>
          <div className="hero-trust">
            <div><strong>2.4K+</strong><span>happy clients</span></div>
            <div><strong>48h</strong><span>dispatch</span></div>
          </div>
          <div className="hero-dots" aria-label="Hero slide controls">
            {slides.map((slide, index) => (
              <button
                key={slide.eyebrow}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                className={index === currentSlide ? 'dot active' : 'dot'}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hero-slider" aria-live="polite">
        <div className="hero-ethnic-motif" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="hero-slider-frame">
          <img src={activeSlide.image} alt={activeSlide.title} />
          <div className="hero-slider-overlay" />
        </div>
        <div className="heritage-badge">
          <span className="heritage-badge-mark">✦</span>
          <span><strong>Indian craft</strong><small>made for modern living</small></span>
        </div>
        <div className="hero-slider-card">
          <span>{activeSlide.note}</span>
          <div className="hero-slider-controls">
            <button type="button" aria-label="Previous slide" onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}>←</button>
            <button type="button" aria-label="Next slide" onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}>→</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
