'use client'
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vendor } from "@prisma/client";

export function VendorSelector({
  vendors,
  selectedVendorId,
}: {
  vendors: (Vendor & {
    _count: {
      VendorProductRate: number;
    }
  })[];
  selectedVendorId: string | null;
}) {
  return (
    <form action="/vendor-rates" method="GET">
      <div className="flex items-center gap-3">
        <Select
          name="vendorId"
          value={selectedVendorId || ""}
          onValueChange={(value) => {
            const form = document.createElement("form");
            form.method = "GET";
            form.action = "/dashboard/vendor-rates/management";
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "vendorId";
            input.value = value;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
          }}
        >
          <SelectTrigger className="w-[300px] bg-white">
            <SelectValue placeholder="Select a vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendors.map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id}>
                <div className="flex items-center justify-between gap-2">
                  <span>{vendor.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {vendor._count.VendorProductRate}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}