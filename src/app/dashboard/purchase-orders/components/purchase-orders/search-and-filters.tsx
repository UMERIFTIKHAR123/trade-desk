import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/prisma";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search } from "lucide-react";

export function SearchAndFilters({
  search,
  customerId
}: {
  search: string;
  customerId: string;
}) {
  return (
    <form action="" method="GET">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            name="search"
            placeholder="Search purchase orders by PO#..."
            defaultValue={search}
            className="w-full"
          />
        </div>
        <CustomerFilter customerId={customerId} />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </form>
  );
}

async function CustomerFilter({ customerId }: { customerId: string }) {
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <Select name="customerId" defaultValue={customerId || "all"}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Customers</SelectItem>
        {customers.map((customer) => (
          <SelectItem key={customer.id} value={customer.id}>
            {customer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
