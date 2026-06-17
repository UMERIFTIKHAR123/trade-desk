import { notFound } from "next/navigation";
import { getCategoryUnique } from "@/lib/db/categories";
import { getProducts } from "@/lib/db/products";
import { CatalogHeader } from "../components/catalog-header";
import { ProductCatalogGrid } from "../components/product-catalog-grid";
import type { CatalogProduct } from "../types";

interface Props {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryProductsPage({ params }: Props) {
  const { categoryId } = await params;

  const category = await getCategoryUnique({
    where: { id: categoryId },
  });

  if (!category) {
    notFound();
  }

  const products = await getProducts({
    where: {
      categoryId,
      isDeleted: false,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const catalogProducts: CatalogProduct[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    category: {
      id: product.category.id,
      name: product.category.name,
    },
  }));

  return (
    <>
      <CatalogHeader
        title={category.name}
        subtitle={`Browse ${catalogProducts.length} ${
          catalogProducts.length === 1 ? "product" : "products"
        } in this collection.`}
        backHref="/catalog"
      />

      {catalogProducts.length === 0 ? (
        <div className="rounded-xl bg-white/70 px-6 py-16 text-center">
          <p className="text-lg font-medium text-[#5c4f45]">
            No products in this category yet.
          </p>
          <p className="mt-2 text-sm text-[#8a7b6f]">
            New items will appear here once they are added.
          </p>
        </div>
      ) : (
        <ProductCatalogGrid products={catalogProducts} />
      )}
    </>
  );
}
