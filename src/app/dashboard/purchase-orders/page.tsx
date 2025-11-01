import prisma from "../../../../src-old/lib/prisma";

import Link from "next/link";
import { Button } from "../../../../src-old/components/ui/button";
import { Plus, ReceiptText } from "lucide-react";
import { columns } from "./components/purchase-orders/columns";
import { SearchAndFilters } from "./components/purchase-orders/search-and-filters";
import { Card, CardContent } from "../../../../src-old/components/ui/card";
import { DataTable } from "../../../../src-old/components/ui/data-table";
import { getPurchaseOrders } from "@/lib/db/purchase-orders";


interface Props {
  searchParams: Promise<{ search?: string; customerId?: string }>;
}

export default async function PurchaseOrders({ searchParams }: Props) {

  const _searchParams = (await searchParams);
  const searchPO = _searchParams.search || "";
  const customerId = _searchParams.customerId || "all";

  const searchPurchaseOrderNo = searchPO.replace(/\D/g, ""); // remove non-digits

  const purchaseOrders = await getPurchaseOrders({
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
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex "><ReceiptText size={34} className="mr-2 self-end" />Purchase Orders</h1>
          <p className="text-muted-foreground">
            Manage your purchase orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild  >
            <Link href="/dashboard/purchase-orders/new">
              <Plus />
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
