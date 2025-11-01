import { Button } from "../../../../../src-old/components/ui/button";
import prisma from "../../../../../src-old/lib/prisma";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../../src-old/components/ui/select";
import { Search } from "lucide-react";
import { getVendors } from "@/lib/db/vendors";

export function SearchAndFilters({
  vendorId
}: {
  vendorId: string;
}) {
  return (
    <form action="" method="GET">
      <div className="flex flex-col sm:flex-row gap-4">

        <VendorFilter vendorId={vendorId} />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </form>
  );
}

async function VendorFilter({ vendorId }: { vendorId: string }) {
  const vendors = await getVendors({
    orderBy: { name: "asc" },
  });

  return (
    <Select name="vendorId" defaultValue={vendorId || "all"}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Vendors</SelectItem>
        {vendors.map((customer) => (
          <SelectItem key={customer.id} value={customer.id}>
            {customer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
