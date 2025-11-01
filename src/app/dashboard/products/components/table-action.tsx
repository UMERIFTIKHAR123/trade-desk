"use client"

import { deleteProduct } from "@/app/dashboard/server-actions/product-actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function TableActions({ product }: { product: any }) {

  async function handleDelete() {
    try {
      const response = await deleteProduct(product.id)

      if (response.success) {
        toast.success(response.message)
      } else {
        toast.error("❌ Failed to delete. Please try again.")
      }

    } catch (error) {
      toast.error("❌ Failed to delete. Please try again.")
    }
  }

  return (
    <div className="space-x-2">
      <Link href={`/dashboard/products/${product.id}/edit`}>
        <Button variant="outline" size="sm" className="mr-2">
          Edit
        </Button>
      </Link>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  )
}
