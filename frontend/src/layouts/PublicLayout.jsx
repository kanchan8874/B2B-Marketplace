import Button from '../components/common/Button.jsx'

const stats = [
  { label: 'Verified suppliers', value: '1,200+' },
  { label: 'Buyer orgs onboarded', value: '480+' },
  { label: 'RFQs processed', value: '18k+' },
]

const PublicLayout = () => (
  <div className="space-y-16">
    <section className="relative overflow-hidden rounded-[56px] border border-white/30 bg-gradient-to-br from-[#f6fbff] via-white to-[#dfe9ff] p-10 shadow-[0_35px_120px_rgba(15,98,254,0.18)] sm:p-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-0 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-primary/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 translate-x-1/3 rounded-full bg-brand-secondary/10 blur-3xl" />
      </div>
      <div className="relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-secondary/30 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary shadow-sm">
          B2B Marketplace MVP
        </div>
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Modern procurement experience for ambitious teams.
          </h1>
          <p className="text-lg text-neutral-600 lg:text-xl">
            Buyers discover vetted products, sellers manage catalogues, and admins retain complete oversight — all in a
            premium, WCAG compliant interface designed for fast RFQs and confident decisions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button as="a" href="/auth/buyer/signup" size="lg" className="px-6">
              Get started as buyer
            </Button>
            <Button as="a" href="/auth/seller/signup" variant="secondary" size="lg" className="px-6">
              Onboard as seller
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 rounded-[32px] border border-white/60 bg-white/70 p-5 text-sm text-neutral-600 shadow-inner backdrop-blur">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-[180px] flex-1 rounded-2xl border border-surface-border/60 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-brand-secondary">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
)

export default PublicLayout
