import Link from "next/link";
import { Boxes } from "lucide-react";
import type { CatalogCategory } from "../types";

type CategoryCardProps = {
  category: CatalogCategory;
  variant: "light" | "white";
};

export function CategoryCard({ category, variant }: CategoryCardProps) {
  const bgClass = variant === "light" ? "bg-[#ece7e2]" : "bg-white";

  return (
    <Link
      href={`/catalog/${category.id}`}
      className={`group flex h-full min-h-[240px] flex-col items-center justify-center rounded-xl border border-[#d5c4b5] px-6 py-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#bfa48f] hover:shadow-md ${bgClass}`}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e8df] text-[#8a7b6f] transition-colors group-hover:bg-[#e8d5c8] group-hover:text-[#5c4f45]">
        <Boxes className="h-7 w-7" />
      </div>

      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#9a8d82]">
        Collection
      </p>
      <h2 className="mt-2 text-lg font-bold uppercase tracking-wide text-[#2d2a26]">
        {category.name}
      </h2>
      <p className="mt-2 text-sm text-[#8a7b6f]">
        {category.productCount}{" "}
        {category.productCount === 1 ? "product" : "products"}
      </p>
    </Link>
  );
}
