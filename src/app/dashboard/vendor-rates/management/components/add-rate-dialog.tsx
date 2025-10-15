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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, ChevronsUpDown, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addUpdateVendorProductRate } from "@/app/dashboard/server-actions/vendor-product-rate-actions";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: {
    name: string;
  };
}

export function AddRateDialog({
  vendorId,
  availableProducts,
  initialProduct,
  initialRate,
}: {
  vendorId: string;
  availableProducts: Product[];
  initialProduct?: Product;
  initialRate?: number;
}) {
  const isUpdate = !!initialProduct;
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct || null);
  const [rate, setRate] = useState(initialRate?.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !rate) {
      toast.error("Error", {
        description: "Please select a product and enter a rate",
      });
      return;
    }

    const rateValue = parseFloat(rate);
    if (isNaN(rateValue) || rateValue <= 0) {
      toast.error("Error", {
        description: "Please enter a valid rate greater than 0",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addUpdateVendorProductRate({
        vendorId,
        productId: selectedProduct.id,
        rate: rateValue,
      });

      if (response.success) {
        toast.success("Success", {
          description: response.message,
        });
      } else {
        toast.error("Error", {
          description: response.message || `Failed to ${isUpdate ? "update" : "add"} product rate`,
        });
      }

      setOpen(false);
      setSelectedProduct(null);
      setRate("");
      router.refresh();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || `Failed to ${isUpdate ? "update" : "add"} product rate`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Product Rate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Update Product Rate" : "Add Product Rate"}</DialogTitle>
          <DialogDescription>
            {isUpdate ? "Update the vendor's rate for this product" : "Select a product and set the vendor's rate for it"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              {isUpdate ? (
                <div className="mt-1 p-2 bg-muted rounded-md flex items-center gap-2">
                  <div className="relative h-6 w-6 rounded overflow-hidden bg-muted flex-shrink-0">
                    {selectedProduct?.imageUrl ? (
                      <Image
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span className="truncate">{selectedProduct?.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {selectedProduct?.category.name}
                  </Badge>
                </div>
              ) : (
                <Popover open={productOpen} onOpenChange={setProductOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={productOpen}
                      className="w-full justify-between"
                    >
                      {selectedProduct ? (
                        <div className="flex items-center gap-2">
                          <div className="relative h-6 w-6 rounded overflow-hidden bg-muted flex-shrink-0">
                            {selectedProduct.imageUrl ? (
                              <Image
                                src={selectedProduct.imageUrl}
                                alt={selectedProduct.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <span className="truncate">{selectedProduct.name}</span>
                        </div>
                      ) : (
                        "Select product..."
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[460px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search products..." />
                      <CommandEmpty>No product found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {availableProducts.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={product.name}
                              onSelect={() => {
                                setSelectedProduct(product);
                                setProductOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProduct?.id === product.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex items-center gap-3 flex-1">
                                <div className="relative h-8 w-8 rounded overflow-hidden bg-muted flex-shrink-0">
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
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    €{product.price.toFixed(2)}
                                  </div>
                                </div>
                                <Badge variant="secondary">
                                  {product.category.name}
                                </Badge>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {selectedProduct && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retail Price:</span>
                  <span className="font-semibold">
                    €{selectedProduct.price.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="rate">Vendor Rate (€)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                required
              />
            </div>

            {selectedProduct && rate && parseFloat(rate) > 0 && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Profit Margin:</span>
                  <span className="font-bold text-primary">
                    {(
                      ((selectedProduct.price - parseFloat(rate)) /
                        selectedProduct.price) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Profit per Unit:</span>
                  <span className="font-bold text-green-600">
                    €{(selectedProduct.price - parseFloat(rate)).toFixed(2)}
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
              {isUpdate ? "Update Rate" : "Add Rate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}