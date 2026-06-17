"use client";

import { useState } from "react";
import type { CatalogProduct } from "../types";
import { ProductCard } from "./product-card";
import { ProductDetailDialog } from "./product-detail-dialog";

type ProductCatalogGridProps = {
  products: CatalogProduct[];
};

export function ProductCatalogGrid({ products }: ProductCatalogGridProps) {
  const [selectedProduct, setSelectedProduct] =
    useState<CatalogProduct | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleView = (product: CatalogProduct) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            variant={index % 2 === 0 ? "light" : "white"}
            onView={handleView}
          />
        ))}
      </div>

      <ProductDetailDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
