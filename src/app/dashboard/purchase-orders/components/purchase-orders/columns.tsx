"use client"

import { Button } from "../../../../../../src-old/components/ui/button"
import { formatCurrency, formatDate, formatPurchaseOrderNo } from "../../../../../../src-old/lib/utils"
import { Customer, PurchaseOrder } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { FileText } from "lucide-react"
import Link from "next/link"
import { DeletePurchaseOrderButton } from "../delete-purchase-order-btn"


type PurchaseOrderWithCustomer = PurchaseOrder & { customer: Customer }

// This type is used to define the columns for the react table
// in the purchase orders page
// You can add more columns as needed
// Make sure to update the PurchaseOrderWithCustomer type accordingly

export const columns: ColumnDef<PurchaseOrderWithCustomer>[] = [
  {
    accessorKey: "orderNo",
    header: "PO#",
    cell: ({ row }) => `${formatPurchaseOrderNo(row.original.orderNo)}`
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      return formatCurrency(row.original.totalAmount)
    }
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt)
    }
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => formatDate(row.original.updatedAt)
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className="flex gap-2 justify-end">
          <Link href={`/dashboard/purchase-orders/${id}`}>
            <Button variant="outline" size="sm">
              <FileText />
            </Button>
          </Link>
          <DeletePurchaseOrderButton id={id} />
        </div>
      )
    }
  }
]