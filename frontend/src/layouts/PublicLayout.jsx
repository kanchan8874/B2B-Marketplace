import Button from '../components/common/Button.jsx'
import OptimizedImage from '../components/common/OptimizedImage.jsx'
import { FALLBACK_IMAGES } from '../constants/images.js'

const stats = [
  { label: 'Verified suppliers', value: '1,200+' },
  { label: 'Buyer orgs onboarded', value: '480+' },
  { label: 'RFQs processed', value: '18k+' },
]

const PublicLayout = () => (
<section
  className="relative w-full min-h-[90vh] overflow-hidden"
  aria-label="Hero section"
>
  {/* Full Width Background Image */}
  <div className="absolute inset-0 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
    <OptimizedImage
      src={FALLBACK_IMAGES.authHero}
      alt=""
      fallback={FALLBACK_IMAGES.authHero}
      className="h-full w-full object-cover"
      loading="eager"
      decoding="async"
      aria-hidden="true"
    />
  </div>

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/75 via-neutral-900/70 to-neutral-900/80" />

  {/* Content (Normal Container, NOT full-width) */}
  <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
    <div className="max-w-4xl space-y-8">
      
      {/* Badge */}
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/20 backdrop-blur-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100 shadow-lg">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-300" aria-hidden="true" />
        B2B Marketplace
      </div>

      {/* Headline */}
      <h1 className="text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
        Modern procurement experience for ambitious teams.
      </h1>

      <p className="max-w-3xl text-lg leading-relaxed text-neutral-100 lg:text-xl">
        Buyers discover vetted products, sellers manage catalogues, and admins retain complete oversight — all in a premium, WCAG compliant interface designed for fast RFQs and confident decisions.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4 pt-2">
        <Button
          as="a"
          href="/auth/buyer/signup"
          size="lg"
          className="min-h-[52px] min-w-[200px] bg-blue-600 px-8 text-base font-semibold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
        >
          Get started as buyer
        </Button>
        <Button
          as="a"
          href="/auth/seller/signup"
          size="lg"
          className="min-h-[52px] min-w-[200px] bg-gradient-to-r from-[#20B2AA] to-[#008B8B] px-8 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-[#1aa497] hover:to-[#007276]"
        >
          Onboard as seller
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-lg hover:bg-white/15 hover:shadow-xl"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-300">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>


)

export default PublicLayout
