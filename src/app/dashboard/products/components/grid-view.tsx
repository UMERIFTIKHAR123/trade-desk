import { Button } from "../../../../../src-old/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../../../src-old/components/ui/card";
import { Package, Edit } from "lucide-react";
import { DeleteProductButton } from "./delete-product-btn";
import Image from "next/image";
import { Category, Product } from "@prisma/client";
import Link from "next/link";

export function GridView({ products }: { products: (Product & { category: Category })[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
          <div className="relative h-48 bg-muted overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <Badge className="absolute top-3 right-3 bg-background/30 backdrop-blur-sm">
              {product.category.name}
            </Badge>
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="line-clamp-1 text-lg hover:underline">
              <Link href={`/dashboard/products/${product.id}`}>{product.name}</Link>
            </CardTitle>
            <CardDescription className="text-xl font-bold text-primary">
              €{product.price.toFixed(2)}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description || "No description available"}
            </p>
          </CardContent>

          <CardFooter className="gap-2 pt-4 border-t">
            <Button asChild variant="outline" className="flex-1" size="sm">
              <Link href={`/dashboard/products/${product.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <DeleteProductButton productId={product.id} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

import { Skeleton } from "../../../../../src-old/components/ui/skeleton";
import { Badge } from "../../../../../src-old/components/ui/badge";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-2" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
