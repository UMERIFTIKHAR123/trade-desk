import prisma from "@/lib/prisma";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ReceiptText } from "lucide-react";
import { columns } from "./components/purchase-orders/columns";
import { SearchAndFilters } from "./components/purchase-orders/search-and-filters";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";


interface Props {
  searchParams: Promise<{ search?: string; customerId?: string }>;
}

export default async function PurchaseOrders({ searchParams }: Props) {

  const _searchParams = (await searchParams);
  const searchPO = _searchParams.search || "";
  const customerId = _searchParams.customerId || "all";

  const searchPurchaseOrderNo = searchPO.replace(/\D/g, ""); // remove non-digits

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where: {
      orderNo: searchPurchaseOrderNo ? parseInt(searchPurchaseOrderNo) : undefined,
      ...(customerId && customerId !== "all" && { customerId })
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return (
    <div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex "><ReceiptText size={34} className="mr-2 self-end" /> Products</h1>
          <p className="text-muted-foreground">
            Manage your purchase orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard/purchase-order/create-v3">
              <Plus className="h-5 w-5 mr-2" />
              New Purchase Order
            </Link>
          </Button>
        </div>
      </div>
      <Card className="mb-5">
        <CardContent>
          <SearchAndFilters search={searchPO} customerId={customerId} />
        </CardContent>
      </Card>
      <DataTable columns={columns} data={purchaseOrders} />
    </div>

  )
}
