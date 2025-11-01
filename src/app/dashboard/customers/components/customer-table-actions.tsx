"use client"


import { deleteCustomer } from "../../../../../src-old/app/dashboard/server-actions/customer-actions"
import Link from "next/link"
import { Button } from "../../../../../src-old/components/ui/button"
import { toast } from "sonner"

export function TableActions({ customer }: { customer: any }) {
 

  async function handleDelete() {
    try {
      const response = await deleteCustomer(customer.id)

      if (response.success) {
        toast.success(response.message)

      } else {
        toast.error(response.message || "❌ Failed to delete. Please try again.")
      }
    } catch {
      toast.error("❌ Failed to delete. Please try again.")
    }
  }

  return (
    <div className="space-x-2">
      <Link href={`/dashboard/customers/${customer.id}/edit`}>
        <Button variant="outline" size="sm" className="mr-2">
          Edit
        </Button>
      </Link>
      <Button variant="destructive" size="sm" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  )
}
