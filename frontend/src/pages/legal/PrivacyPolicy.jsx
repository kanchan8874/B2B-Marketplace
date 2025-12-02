const PrivacyPolicy = () => (
  <main className="w-full bg-surface-base px-4 py-10 sm:px-6 lg:px-8">
    {/* Hero */}
    <section className="mx-auto max-w-5xl">
      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-32 w-32 rounded-full bg-emerald-300/30 blur-3xl" />

        <div className="relative space-y-3">
          <p className="inline-flex items-center rounded-full bg-blue-900/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100">
            Privacy &amp; trust
          </p>
          <h1 className="text-2xl font-bold leading-snug sm:text-3xl">
            Clear, transparent privacy for ambitious B2B teams.
          </h1>
          <p className="max-w-2xl text-[13px] leading-relaxed text-blue-100/90">
            We keep your account, business, RFQ and KYC data secure, and use it only to run this marketplace. No
            surprise usage, no resale of your data.
          </p>
        </div>
      </div>
    </section>

    {/* Content */}
    <section className="mx-auto flex max-w-5xl flex-col text-sm text-neutral-700">
      <article className="rounded-b-2xl bg-white/95 px-8 py-7 shadow-[0_16px_40px_rgba(15,23,42,0.08)] space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-neutral-900">1. Data we collect</h2>
          <p className="mt-3 leading-relaxed">
            We collect only the information needed to run the marketplace: account details (name, email, role), business
            information (company name, GST / tax IDs, address), and activity data (RFQs, products, messages, KYC
            records). We do not collect sensitive personal information unrelated to B2B commerce.
          </p>
        </section>

        <hr className="border-t border-neutral-200" />

        <section>
          <h2 className="text-lg font-semibold text-neutral-900">2. How we use your data</h2>
          <p className="mt-3 leading-relaxed">
            We use your data to create and secure your account, route RFQs and messages, support KYC checks, publish or
            moderate product listings, and send important service notifications (such as verification results or RFQ
            updates). We never sell your data to advertisers.
          </p>
        </section>

        <hr className="border-t border-neutral-200" />

        <section>
          <h2 className="text-lg font-semibold text-neutral-900">3. Who can see your data</h2>
          <p className="mt-3 leading-relaxed">
            Only authorised internal teams and systems can access your information, and only for legitimate business
            purposes such as onboarding, KYC review, support, fraud prevention and compliance reporting. Within the
            marketplace, buyers and sellers see only the information needed to evaluate opportunities and manage RFQs.
          </p>
        </section>

        <hr className="border-t border-neutral-200" />

        <section>
          <h2 className="text-lg font-semibold text-neutral-900">4. Your choices &amp; rights</h2>
          <p className="mt-3 leading-relaxed">
            You can update your profile and notification preferences at any time from your workspace. Depending on your
            jurisdiction, you may also request access to, correction of, or deletion of certain personal data. To raise
            a privacy question, please contact our support team and we will guide you through the process.
          </p>
        </section>
      </article>
    </section>
  </main>
)

export default PrivacyPolicy


