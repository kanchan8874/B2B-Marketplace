const TermsOfUse = () => (
  <main className="w-full bg-surface-base px-4 py-10 sm:px-6 lg:px-8">
    {/* Hero */}
    <section className="mx-auto max-w-5xl">
      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-32 w-32 rounded-full bg-cyan-500/25 blur-3xl" />

        <div className="relative space-y-3">
          <p className="inline-flex items-center rounded-full bg-slate-700/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200">
            Platform terms
          </p>
          <h1 className="text-2xl font-bold leading-snug sm:text-3xl">
            Clear rules for running a safe, modern B2B marketplace.
          </h1>
          <p className="max-w-2xl text-[13px] leading-relaxed text-slate-200/90">
            These terms explain how buyers, sellers and admins work together on the platform to source, evaluate and
            fulfil RFQs in a secure, compliant way.
          </p>
        </div>
      </div>
    </section>

    {/* Content (single card continuing from hero) */}
    <section className="mx-auto flex max-w-5xl flex-col text-sm text-neutral-700">
      <article className="rounded-b-2xl bg-white/95 px-8 py-7 shadow-[0_16px_40px_rgba(15,23,42,0.12)] space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-neutral-900">1. Using the platform</h2>
          <p className="mt-3 leading-relaxed">
            You agree to provide accurate information, protect your credentials, and use the marketplace only for
            lawful, business-to-business procurement or sales purposes. Any attempt to misuse the platform, share
            credentials or bypass controls may result in suspension.
          </p>
        </section>

        <hr className="border-t border-neutral-200" />

        <section>
          <h2 className="text-lg font-semibold text-neutral-900">2. Content &amp; responsibilities</h2>
          <p className="mt-3 leading-relaxed">
            Sellers are responsible for the accuracy and legality of their product catalogues, certifications and
            commercial terms. Buyers are responsible for the accuracy of RFQs, evaluations and purchase decisions.
            Admins oversee compliance, product moderation and overall marketplace quality.
          </p>
        </section>

        <hr className="border-t border-neutral-200" />

        <section>
          <h2 className="text-lg font-semibold text-neutral-900">3. Moderation &amp; suspension</h2>
          <p className="mt-3 leading-relaxed">
            We may review RFQs, listings and conversations for policy violations, fraud or abuse. We may hide, restrict
            or remove content and suspend accounts that do not comply with legal, ethical or platform guidelines,
            especially where trust or safety is at risk.
          </p>
        </section>

        <hr className="border-t border-neutral-200" />

        <section>
          <h2 className="text-lg font-semibold text-neutral-900">4. Changes to these terms</h2>
          <p className="mt-3 leading-relaxed">
            We may update these terms as we add new features or respond to legal and regulatory changes. Where changes
            are material, we will highlight them within the platform or by email so that your teams can review them in
            advance.
          </p>
        </section>
      </article>
    </section>
  </main>
)

export default TermsOfUse


