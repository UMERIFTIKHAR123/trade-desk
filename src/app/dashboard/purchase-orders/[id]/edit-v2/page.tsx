import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { ArrowLeft, History } from "lucide-react";
import { notFound } from "next/navigation";
import { EditPurchaseOrderForm } from "./components/edit-purchase-order-form";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPurchaseOrderPage({ params }: Props) {

  const { id } = await params;

  console.log("Purchase Order ID: ", id);

  const purchaseOrder = await prisma.purchaseOrder.findUnique({
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


  const products = await prisma.product.findMany({
    include: {
      category: true
    }
  });
  const customers = await prisma.customer.findMany();

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
              <span>Order ID: {purchaseOrder.id}</span>
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

      <EditPurchaseOrderForm purchaseOrder={purchaseOrder} products={products} customers={customers} />

    </div>
  );
}