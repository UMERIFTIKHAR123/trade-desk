"use client"

import { Button } from "../../../../../src-old/components/ui/button"
import { formatDate } from "../../../../../src-old/lib/utils"
import { Customer } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Edit } from "lucide-react"
import Link from "next/link"
import { CustomerDeleteButton } from "./customer-delete-btn"

export const columns: ColumnDef<Customer>[] = [
  {
    id: "sr.no",
    header: "Sr.No",
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: "name",
    header: "Customer",
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    accessorKey: "phone",
    header: "Phone",
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
          <Link href={`/dashboard/customers/${customer.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <CustomerDeleteButton customerId={customer.id} />
        </div>
      )
    }
  }
]