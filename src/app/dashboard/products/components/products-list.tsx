import { Button } from "@/components/ui/button";
import { Package, Link, Plus } from "lucide-react";
import { GridView } from "./grid-view";
import { TableView } from "./table-view";
import { getProducts, getProductsCount } from "@/lib/db/products";
import { PaginationClient } from "./pagination-client";

const ITEMS_PER_PAGE = 12;

export async function ProductsList({
  view,
  search,
  categoryId,
  page = 1
}: {
  view: string;
  search: string;
  categoryId: string;
  page?: number;
}) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const where = {
    isDeleted: false,
    ...(search && {
      name: { contains: search, mode: "insensitive" as const }
    }),
    ...(categoryId && categoryId !== "all" && { categoryId })
  };

  const [products, totalCount] = await Promise.all([
    getProducts({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip
    }),
    getProductsCount(where)
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {search || categoryId !== "all"
            ? "Try adjusting your search or filter criteria."
            : "Get started by creating your first product. Add details, images, and pricing to showcase your inventory."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {view === "grid" ? (
        <GridView products={products} />
      ) : (
        <TableView products={products} />
      )}
      {totalPages > 1 && (
        <PaginationClient
          currentPage={page}
          totalPages={totalPages}
          view={view}
          search={search}
          categoryId={categoryId}
        />
      )}
    </div>
  );
}
