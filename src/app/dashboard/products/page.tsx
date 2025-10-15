import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"
import { Box, LayoutGrid, Package, Plus, TableIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TableSkeleton } from "./components/table-view"
import { ProductCardSkeleton } from "./components/grid-view"
import { SearchAndFilters } from "./components/search-and-filters"
import { ProductsList } from "./components/products-list"
import { Card, CardContent, CardFooter } from "@/components/ui/card"



interface Props {
  searchParams: Promise<{ view?: string; search?: string; categoryId?: string }>;
}

export default async function ProductPage({ searchParams }: Props) {
  const _searchParams = (await searchParams);
  const view = _searchParams.view || "grid";
  const search = _searchParams.search || "";
  const categoryId = _searchParams.categoryId || "all";

  return (
    <div className="">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex "><Box size={34} className="mr-2 self-end" /> Products</h1>
          <p className="text-muted-foreground">
            Manage your products 
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} />
          <Button asChild size="lg">
            <Link href="/dashboard/products/new">
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent>
          <form action="" method="GET">
            <input type="hidden" name="view" value={view} />
            <Suspense fallback={<Skeleton className="h-10 w-full" />}>
              <SearchAndFilters search={search} categoryId={categoryId} />
            </Suspense>
          </form>
        </CardContent>
      </Card>


      <Suspense
        fallback={
          view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <TableSkeleton />
          )
        }
      >
        <ProductsList view={view} search={search} categoryId={categoryId} />
      </Suspense>
    </div>
  )
}



function ViewToggle({ view }: { view: string }) {
  return (
    <form>
      <ToggleGroup type="single" value={view} className="border rounded-lg p-1">
        <ToggleGroupItem value="grid" aria-label="Grid view" asChild>
          <Link href="?view=grid" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <LayoutGrid className="h-4 w-4" />
            Grid
          </Link>
        </ToggleGroupItem>
        <ToggleGroupItem value="table" aria-label="Table view" asChild>
          <Link href="?view=table" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <TableIcon className="h-4 w-4" />
            Table
          </Link>
        </ToggleGroupItem>
      </ToggleGroup>
    </form>
  );
}