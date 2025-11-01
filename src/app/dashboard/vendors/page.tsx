import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Users } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./components/vendors-list"
import { getVendors } from "@/lib/db/vendors"

export default async function VendorPage() {
  const vendors = await getVendors({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex "><Users size={34} className="mr-2 self-end" /> Vendors</h1>
          <p className="text-muted-foreground">
            Manage your vendors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard/vendors/new">
              <Plus className="h-5 w-5 mr-2" />
              New Vendor
            </Link>
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={vendors} />

    </div>
  )
}
