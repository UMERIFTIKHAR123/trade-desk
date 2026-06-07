import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { ArrowLeft, History } from "lucide-react";
import { notFound } from "next/navigation";
import { EditPurchaseOrderForm } from "./components/edit-purchase-order-form";
import Link from "next/link";
import { getCustomers } from "@/lib/db/customers";
import { getProducts } from "@/lib/db/products";
import { getPurchaseOrderUnique } from "@/lib/db/purchase-orders";
import { ActiveStep, PurchaseOrderProvider } from "../../context/purchase-order-context";
import { formatPurchaseOrderNo } from "@/lib/utils";
import { POCartDrawer } from "../../new/components/po-cart-drawer";
import { ProductsList } from "../../new/components/products-list";
import { getCategories } from "@/lib/db/categories";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ step: ActiveStep }>;
}

export default async function EditPurchaseOrderPage({ params, searchParams }: Props) {

  const { id } = await params;

  const purchaseOrder = await getPurchaseOrderUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true
        }
      },
    }
  })

  if (!purchaseOrder) {
    return notFound();
  }

  const { step = "COMPLETE-PO" } = (await searchParams)

  const products = await getProducts({
    include: {
      category: true
    },
    orderBy: { name: 'asc' }
  });

  const categories = await getCategories({ orderBy: { name: 'asc' } })

  const customers = await getCustomers();

  const formatDate = (date: Date) => {
    return dayjs(date).format("DD-MM-YYYY hh:mm a")
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/purchase-orders/${purchaseOrder.id}`}>
            <Button
              variant="ghost"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Purchase Order</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>PO#: {formatPurchaseOrderNo(purchaseOrder.orderNo)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <History className="h-3 w-3" />
                <span>Created: {formatDate(purchaseOrder.createdAt)}</span>
              </div>
              <span>•</span>
              <span>Last updated: {formatDate(purchaseOrder.updatedAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/purchase-orders/${purchaseOrder.id}`}>
            <Button variant="outline">
              Cancel
            </Button>
          </Link>

        </div>
      </div>

      <PurchaseOrderProvider
        initialFormValues={{
          id: purchaseOrder.id,
          customerId: purchaseOrder.customerId,
          items: purchaseOrder.items.map(({ id, productId, price, quantity, dto, iva, product }) =>
          ({
            id, productId, price, quantity, dto, iva, name: product.name, imageUrl: product.imageUrl!
          }))
        }}>

        {step === 'CHOOSE-PRODUCTS' && (
          <>
            <POCartDrawer />
            <ProductsList products={products} categories={categories} />
          </>
        )}
        {step === 'COMPLETE-PO' && (
          <EditPurchaseOrderForm purchaseOrder={purchaseOrder} products={products} customers={customers} />
        )}
      </PurchaseOrderProvider>

    </div>
  );
}