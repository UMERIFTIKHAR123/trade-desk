"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import type { CatalogProduct } from "../types";

type ProductCardProps = {
  product: CatalogProduct;
  variant: "light" | "white";
  onView: (product: CatalogProduct) => void;
};

export function ProductCard({ product, variant, onView }: ProductCardProps) {
  const bgClass = variant === "light" ? "bg-[#ece7e2]" : "bg-white";

  return (
    <article
      className={`group flex h-full flex-col items-center rounded-xl border border-[#d5c4b5] px-4 py-12 text-center shadow-sm transition-all duration-300 hover:border-[#bfa48f] hover:shadow-md sm:px-6 ${bgClass}`}
    >
      <button
        type="button"
        onClick={() => onView(product)}
        className="mb-8 flex h-56 w-full cursor-pointer items-center justify-center px-2 transition-transform duration-300 group-hover:scale-105 sm:h-60"
        aria-label={`View ${product.name}`}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={300}
            className="h-full w-full max-h-56 rounded-md object-cover object-center drop-shadow-md sm:max-h-60"
          />
        ) : (
          <Package className="h-24 w-24 text-[#b8aea4]" />
        )}
      </button>

      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#9a8d82]">
        {product.category.name}
      </p>

      <h3 className="mt-2 w-full max-w-[320px] px-2 text-sm font-bold uppercase leading-snug tracking-wide text-[#2d2a26] sm:text-base">
        {product.name}
      </h3>

      <p className="mt-3 text-base font-bold text-[#2d2a26]">
        €{product.price.toFixed(2)}
      </p>

      <button
        type="button"
        onClick={() => onView(product)}
        className="mt-6 min-w-[140px] bg-[#e8d0c0] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#4a4038] transition-colors hover:bg-[#ddc0ad]"
      >
        View Item
      </button>
    </article>
  );
}
