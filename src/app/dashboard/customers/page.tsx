import { Button } from "../../../../src-old/components/ui/button"
import Link from "next/link"
import { Plus, Users } from "lucide-react"
import { DataTable } from "../../../../src-old/components/ui/data-table"
import { columns } from "./components/customers-list"
import { getCustomers } from "@/lib/db/customers"

export default async function CustomerPage() {

  const customers = await getCustomers();

  return (
    <div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex "><Users size={34} className="mr-2 self-end" /> Customers</h1>
          <p className="text-muted-foreground">
            Manage your customers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard/customers/new">
              <Plus className="h-5 w-5 mr-2" />
              New Customer
            </Link>
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={customers} />

    </div>
  )
}
