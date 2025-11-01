import { Skeleton } from "../../../../../src-old/components/ui/skeleton";
import prisma from "../../../../../src-old/lib/prisma";
import { Suspense } from "react";
import { VendorSelector } from "./components/vendor-selector";
import { EmptyState } from "./components/empty-state";
import { VendorRatesData } from "./components/vendor-rates-data";
import { getVendors } from "@/lib/db/vendors";

interface Props {
  searchParams: Promise<{ vendorId?: string }>
}

export default async function ManagementPage({ searchParams }: Props) {

  const _searchParams = (await searchParams);
  const selectedVendorId = _searchParams.vendorId || null;

  const vendors = await getVendors({
    include: {
      _count: {
        select: { VendorProductRate: true }
      }
    },
    orderBy: {
      name: "asc"
    }
  });


  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Vendor Product Rates
          </h1>
          <p className="text-muted-foreground">
            Manage and compare product rates across different vendors
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Suspense fallback={<Skeleton className="h-10 w-[300px]" />}>
          <VendorSelector
            vendors={vendors}
            selectedVendorId={selectedVendorId}
          />
        </Suspense>
      </div>


      {selectedVendorId ? (
        <Suspense
          fallback={
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          }
        >
          <VendorRatesData vendorId={selectedVendorId} />
        </Suspense>
      ) : (
        <EmptyState />
      )}

    </div>
  )
}

