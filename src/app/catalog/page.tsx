import { getCategories } from "@/lib/db/categories";
import { CatalogHeader } from "./components/catalog-header";
import { CategoryCard } from "./components/category-card";
import type { CatalogCategory } from "./types";

export default async function CatalogPage() {
  const categories = await getCategories({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          products: { where: { isDeleted: false } },
        },
      },
    },
  });

  const catalogCategories: CatalogCategory[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
  }));

  const visibleCategories = catalogCategories.filter(
    (category) => category.productCount > 0,
  );

  return (
    <>
      <CatalogHeader
        title="Our Collections"
        subtitle="Explore our curated categories and discover products crafted for your needs."
      />

      {visibleCategories.length === 0 ? (
        <div className="rounded-xl bg-white/70 px-6 py-16 text-center">
          <p className="text-lg font-medium text-[#5c4f45]">
            No categories available yet.
          </p>
          <p className="mt-2 text-sm text-[#8a7b6f]">
            Check back soon for our latest collections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              variant={index % 2 === 0 ? "light" : "white"}
            />
          ))}
        </div>
      )}
    </>
  );
}
