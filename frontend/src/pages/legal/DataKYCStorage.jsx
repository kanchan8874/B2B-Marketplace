const DataKYCStorage = () => (
  <main className="w-full bg-surface-base px-4 py-10 sm:px-6 lg:px-8">
    {/* Hero */}
    <section className="mx-auto max-w-5xl">
      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-32 w-32 rounded-full bg-sky-300/30 blur-3xl" />

        <div className="relative space-y-3">
          <p className="inline-flex items-center rounded-full bg-emerald-900/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
            KYC &amp; compliance
          </p>
          <h1 className="text-2xl font-bold leading-snug sm:text-3xl">
            Secure storage for seller and buyer KYC documents.
          </h1>
          <p className="max-w-2xl text-[13px] leading-relaxed text-emerald-50/95">
            We treat KYC uploads as highly sensitive data, with controlled access, clear retention rules, and strict use
            for verification only.
          </p>
        </div>
      </div>
    </section>

    {/* Content */}
    <section className="mx-auto flex max-w-5xl flex-col text-sm text-neutral-700">
      <article className="rounded-b-2xl bg-white/95 px-8 py-7 shadow-[0_16px_40px_rgba(4,120,87,0.14)] space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-neutral-900">1. What KYC data we store</h2>
          <p className="mt-3 leading-relaxed">
            For sellers and buyers, we store business identity details (legal name, address, GST or tax IDs),
            registration documents and verification notes. We also keep a minimal audit log of who approved or rejected
            the KYC and when.
          </p>
        </section>

        <hr className="border-t border-neutral-200" />

        <section>
          <h2 className="text-lg font-semibold text-neutral-900">2. Where and how we store documents</h2>
          <p className="mt-3 leading-relaxed">
            KYC files are stored on secure servers with restricted access. Only authorised admin users can open or
            download documents, and only for verification, audits or fraud prevention. Access is logged for compliance
            reviews and security investigations.
          </p>
        </section>

        <hr className="border-t border-neutral-200" />

        <section>
          <h2 className="text-lg font-semibold text-neutral-900">3. Retention</h2>
          <p className="mt-3 leading-relaxed">
            We retain KYC data only while it is needed for regulatory, contractual or internal risk requirements. When
            data is no longer needed, we delete or anonymise it in a controlled manner according to our retention
            schedule and local regulations.
          </p>
        </section>

        <hr className="border-t border-neutral-200" />

        <section>
          <h2 className="text-lg font-semibold text-neutral-900">4. Access &amp; corrections</h2>
          <p className="mt-3 leading-relaxed">
            You can request a summary of the KYC information we hold for your organisation, update outdated details or
            raise a support request to adjust stored documents where regulations and contracts allow. KYC visibility
            inside the product is limited to a simple verified badge.
          </p>
        </section>
      </article>
    </section>
  </main>
)

export default DataKYCStorage


