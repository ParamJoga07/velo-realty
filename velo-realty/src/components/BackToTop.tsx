type BackToTopProps = {
  visible: boolean
}

export function BackToTop({ visible }: BackToTopProps) {
  if (!visible) {
    return null
  }

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      ↑
    </button>
  )
}
