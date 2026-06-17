"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CatalogProduct } from "../types";

type ProductDetailDialogProps = {
  product: CatalogProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
}: ProductDetailDialogProps) {
  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-none bg-[#faf7f4] p-0 sm:max-w-3xl">
        <div className="grid sm:grid-cols-2">
          <div className="relative flex min-h-[280px] items-center justify-center bg-[#ece7e2] p-8 sm:min-h-[420px]">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={480}
                height={480}
                className="max-h-[340px] w-auto object-contain drop-shadow-xl"
                priority
              />
            ) : (
              <Package className="h-24 w-24 text-[#b8aea4]" />
            )}
          </div>

          <div className="flex flex-col justify-center px-6 py-8 sm:px-8">
            <DialogHeader className="space-y-4 text-left">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#9a8d82]">
                {product.category.name}
              </p>
              <DialogTitle className="text-2xl font-bold uppercase tracking-wide text-[#2d2a26]">
                {product.name}
              </DialogTitle>
              <DialogDescription asChild>
                <p className="text-2xl font-bold text-[#2d2a26]">
                  €{product.price.toFixed(2)}
                </p>
              </DialogDescription>
            </DialogHeader>

            {product.description ? (
              <p className="mt-6 text-sm leading-relaxed text-[#6f645b]">
                {product.description}
              </p>
            ) : (
              <p className="mt-6 text-sm italic text-[#9a8d82]">
                No description available for this product.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
