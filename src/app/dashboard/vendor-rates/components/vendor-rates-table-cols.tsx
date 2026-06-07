"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Product, Vendor, VendorProductRate } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Edit } from "lucide-react"
import Link from "next/link"

type VendorRatesTableColsProps = VendorProductRate & { vendor: Vendor; product: Product };

export const columns: ColumnDef<VendorRatesTableColsProps>[] = [
  {
    id: "sr.no",
    header: "Sr.No",
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: "vendor.name",
    header: "Vendor",
  },
  {
    accessorKey: "product.name",
    header: "Product",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => `$${formatCurrency(row.original.rate)}`
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt)
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original
      return (
        <div className="flex gap-2 justify-end">
          <Link href={`/dashboard/vendors/${customer.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          {/* <VendorDeleteButton customerId={customer.id} /> */}
        </div>
      )
    }
  }
]