import brandLogo from '../../assets/G&T.png'

function Footer({ onOpenCatalog }) {
  return (
    <footer>
      <button className="brand footer-brand" type="button" onClick={onOpenCatalog} aria-label="G&T Collections home">
        <img src={brandLogo} alt="G&T Collections logo" className="brand-logo footer-logo" />
      </button>
      <p>Made for the in-between moments.</p>
      <p>© 2025 G&amp;T Collections</p>
    </footer>
  )
}

export default Footer
