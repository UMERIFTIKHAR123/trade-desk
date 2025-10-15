import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableActions } from "./components/customer-table-actions"
import { Plus, Users } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./components/customers-list"

export default async function CustomerPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  })

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
