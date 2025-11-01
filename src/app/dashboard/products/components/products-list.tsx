import { Button } from "@/components/ui/button";
import { Package, Link, Plus } from "lucide-react";
import { GridView } from "./grid-view";
import { TableView } from "./table-view";
import { getProducts } from "@/lib/db/products";


export async function ProductsList({
  view,
  search,
  categoryId
}: {
  view: string;
  search: string;
  categoryId: string;
}) {

  const products = await getProducts({
    where: {
      isDeleted: false,
      ...(search && {
        name: { contains: search, mode: "insensitive" }
      }),
      ...(categoryId && categoryId !== "all" && { categoryId })
    },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  })

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No products yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Get started by creating your first product. Add details, images, and pricing to showcase your inventory.
        </p>
      </div>
    );
  }

  return view === "grid" ? (
    <GridView products={products} />
  ) : (
    <TableView products={products} />
  );
}
