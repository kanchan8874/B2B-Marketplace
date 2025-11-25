import { useMemo } from 'react'
import { Package, Store, FileText, Inbox as InboxIcon } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import ProductListTable from '../../components/seller/ProductListTable.jsx'
import RFQList from '../../components/seller/RFQList.jsx'
import { products } from '../../mocks/products.js'
import { rfqs } from '../../mocks/rfqs.js'

const SellerDashboard = () => {
  const kpis = useMemo(
    () => [
      { label: 'Live products', value: products.length, helper: 'Approved items ready for buyers', icon: Package },
      { label: 'Pending approvals', value: 2, helper: 'Listings awaiting review', icon: Store },
      { label: 'Open RFQs', value: rfqs.length, helper: 'Buyers awaiting your response', icon: FileText },
      { label: 'Responded this week', value: 3, helper: 'Keep momentum high', icon: InboxIcon },
    ],
    []
  )

  return (
    <div className="space-y-10">
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className="bg-gradient-to-br from-white to-brand-secondary/5">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-brand-secondary/10 p-3 text-brand-secondary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-brand-secondary">{kpi.label}</p>
                  <p className="text-3xl font-semibold text-neutral-900">{kpi.value}</p>
                  <p className="text-sm text-neutral-500">{kpi.helper}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </section>

      <Card
        title="Product performance"
        subtitle="Keep pricing transparent and MOQ updated to stay searchable."
        actions={
          <Button as="a" href="/seller/products/new">
            Add new product
          </Button>
        }
      >
        <ProductListTable
          items={products.map((product) => ({
            ...product,
            shortDescription: product.shortDescription,
            status: product.priceMin < 50 ? 'Pending' : 'Live',
          }))}
        />
      </Card>

      <Card
        title="RFQ inbox"
        subtitle="Respond quickly to convert demand into business."
        actions={
          <Button as="a" href="/seller/rfqs" variant="secondary">
            View all RFQs
          </Button>
        }
      >
        <RFQList items={rfqs} />
      </Card>
    </div>
  )
}

export default SellerDashboard


