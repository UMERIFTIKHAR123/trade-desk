import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCustomers } from "@/lib/db/customers";
import { getProducts } from "@/lib/db/products";
import { ActiveStep, PurchaseOrderProvider } from "../context/purchase-order-context";
import { POCartDrawer } from "./components/po-cart-drawer";
import { ProductsList } from "./components/products-list";
import { CreatePurchaseOrderForm } from "./components/create-purchase-order-form";
import { getCategories } from "@/lib/db/categories";


interface Props {
  searchParams: Promise<{ step: ActiveStep }>
}

export default async function CreatePurchaseOrderPage({ searchParams }: Props) {

  const customers = await getCustomers({ orderBy: { name: 'asc' } });
  const products = await getProducts({ include: { category: true }, orderBy: { name: 'asc' } });
  const categories = await getCategories({ orderBy: { name: 'asc' } })

  const { step = "CHOOSE-PRODUCTS" } = (await searchParams)

  return (
    <div className="">
      <div className="space-y-6">
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
        <PurchaseOrderProvider>
          {step === 'CHOOSE-PRODUCTS' && (
            <>
              <POCartDrawer />
              <ProductsList products={products} categories={categories} />
            </>
          )}
          {step === 'COMPLETE-PO' && (
            <CreatePurchaseOrderForm customers={customers} products={products} />
          )}
        </PurchaseOrderProvider>
      </div>
    </div>
  )
}