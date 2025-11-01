import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../../src-old/components/ui/card";
import { DollarSign, Mail, Package, Phone, Store } from "lucide-react";

export function VendorInfoCard({ vendor }: { vendor: any }) {
  const totalProducts = vendor.VendorProductRate.length;
  const avgRate =
    totalProducts > 0
      ? vendor.VendorProductRate.reduce(
        (sum: number, rate: any) => sum + rate.rate,
        0
      ) / totalProducts
      : 0;

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{vendor.name}</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-1">
                {vendor.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {vendor.email}
                  </span>
                )}
                {vendor.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {vendor.phone}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Rate</p>
              <p className="text-2xl font-bold">
                ${avgRate > 0 ? avgRate.toFixed(2) : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}