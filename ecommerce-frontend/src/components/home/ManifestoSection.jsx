function ManifestoSection({ onOpenCatalog }) {
  return (
    <section className="manifesto" id="story">
      <div className="manifesto-mark">✳</div>
      <p>We believe the things<br />around you should feel<br /><em>like you.</em></p>
      <button type="button" className="story-link" onClick={onOpenCatalog}>Read our story <span>↗</span></button>
    </section>
  )
}

export default ManifestoSection
