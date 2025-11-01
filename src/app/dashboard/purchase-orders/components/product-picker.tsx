"use client";

import { useState } from "react";
import { Button } from "../../../../../src-old/components/ui/button";
import { Badge } from "../../../../../src-old/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../../../src-old/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../src-old/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../../../../src-old/lib/utils";
import { Category, Product } from "@prisma/client";

interface ProductPickerProps {
  products: (Product & { category: Category })[];
  selectedProductId?: string;
  onSelect: (productId: string) => void;
  disabled?: boolean;
}

export function ProductPicker({
  products,
  selectedProductId,
  onSelect,
  disabled = false
}: ProductPickerProps) {
  const [productSearch, setProductSearch] = useState("");
  const [open, setOpen] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedProduct ? (
            <div className="flex items-center gap-2">
              {selectedProduct.imageUrl && (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="h-6 w-6 rounded object-cover"
                />
              )}
              <span className="truncate">{selectedProduct.name}</span>
            </div>
          ) : (
            "Select product..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search products..."
            value={productSearch}
            onValueChange={setProductSearch}
          />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.id}
                  onSelect={() => {
                    onSelect(product.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-8 w-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {product.category.name}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedProductId === product.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}