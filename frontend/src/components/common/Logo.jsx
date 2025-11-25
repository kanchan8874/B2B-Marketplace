const Logo = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-[0_4px_12px_rgba(15,98,254,0.35)]">
        <span className="text-sm font-semibold tracking-[0.25em]">B2B</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-surface-border bg-white px-3 py-1.5 shadow-card">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <span className="text-base font-semibold tracking-[0.2em]">B2B</span>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary">Premium</p>
        <p className="text-base font-semibold text-neutral-900">Marketplace</p>
      </div>
    </div>
  )
}

export default Logo

