"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addUpdateVendorProductRate } from "@/app/dashboard/server-actions/vendor-product-rate-actions";
import { Category, Product, VendorProductRate } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";


interface Props {
  rate: VendorProductRate & { product: Product & { category: Category } }
}

export function EditRateDialog({ rate }: Props) {
  const [open, setOpen] = useState(false);
  const [rateValue, setRateValue] = useState(rate.rate.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rateValue) {
      toast.error("Error", {
        description: "Please enter a rate"
      })

      return;
    }

    const newRate = parseFloat(rateValue);
    if (isNaN(newRate) || newRate <= 0) {
      toast.error("Error", {
        description: "Please enter a valid rate greater than 0"
      })
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addUpdateVendorProductRate({
        vendorId: rate.vendorId,
        productId: rate.productId,
        rate: newRate,
      });

      if (response.success) {
        toast.success("Success", {
          description: response.message,
        });
      } else {
        toast.error("Error", {
          description: response.message
        });
      }

      setOpen(false);

    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to update product rate",
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const { product } = rate;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product Rate</DialogTitle>
          <DialogDescription>
            Update the vendor's rate for this product
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <div className="mt-1 p-2 bg-muted rounded-md flex items-center gap-2">
                <div className="relative h-6 w-6 rounded overflow-hidden bg-muted flex-shrink-0">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <span className="truncate">{product.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  {product.category.name}
                </Badge>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Retail Price:</span>
                <span className="font-semibold">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Vendor Rate (€)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={rateValue}
                onChange={(e) => setRateValue(e.target.value)}
                required
              />
            </div>

            {rateValue && parseFloat(rateValue) > 0 && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Profit Margin:</span>
                  <span className="font-bold text-primary">
                    {(
                      ((product.price - parseFloat(rateValue)) /
                        product.price) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Profit per Unit:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(product.price - parseFloat(rateValue))}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Rate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}