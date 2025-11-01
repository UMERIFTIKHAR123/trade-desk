import { DataTable } from "@/components/ui/data-table";
import { columns } from "./components/vendor-rates-table-cols";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HandCoins, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchAndFilters } from "./components/search-filters";
import { getVendorProductsRates } from "@/lib/db/vendors-products-rates";


interface Props {
  searchParams: Promise<{ vendorId?: string }>;
}

export default async function VendorRatesPage({ searchParams }: Props) {

  const _searchParams = (await searchParams);
  const vendorId = _searchParams.vendorId || "all";

  const vendorRates = await getVendorProductsRates({
    where: {
      vendorId: vendorId && vendorId !== "all" ? vendorId : undefined
    },
    include: {
      vendor: true,
      product: true
    },
    orderBy: {
      updatedAt: "desc"
    }
  });


  return (
    <div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex "><HandCoins size={34} className="mr-2 self-end" /> Vendor Rates</h1>
          <p className="text-muted-foreground">
            Manage vendor rates
          </p>
        </div>
        <div className="flex items-center gap-3">

          <Button asChild size="lg">
            <Link href="/dashboard/vendor-rates/new">
              <Plus className="h-5 w-5 mr-2" />
              Add Vendor Rate
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-5">
        <CardContent>
          <SearchAndFilters vendorId={vendorId} />
        </CardContent>
      </Card>

      <DataTable columns={columns} data={vendorRates} />
    </div>
  )
}