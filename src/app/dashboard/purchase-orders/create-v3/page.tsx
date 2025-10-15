import { Button } from "@/components/ui/button";
import { CreatePurchaseOrderForm } from "./components/create-purchase-order-form";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function CreatePurchaseOrderPage() {

  const customers = await prisma.customer.findMany();
  const products = await prisma.product.findMany({
    include: {
      category: true
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Purchase Order</h1>
            <p className="text-gray-600">Add a new purchase order to your system</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/purchase-orders">
              <Button variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </div>

        {/* Form Section */}
        <CreatePurchaseOrderForm customers={customers} products={products} />
      </div>
    </div>
  )
}