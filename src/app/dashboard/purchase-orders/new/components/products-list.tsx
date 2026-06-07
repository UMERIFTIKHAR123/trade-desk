'use client'
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { Category, Product } from "@prisma/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Package } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  products: (Product & { category: Category })[];
  categories: Category[];
}

export const ProductsList = ({ products, categories }: Props) => {
  const [query, setQuery] = useState("");
  const [selectedCategoryId, setCagtegoryId] = useState('all');


  const normalizedQuery = query.trim().toLowerCase();

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategoryId === "all" || product.categoryId === selectedCategoryId;

    const matchesQuery =
      !normalizedQuery || product.name?.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });


  return (
    <div>

      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-1">Categories</h3>
      <div className="flex gap-2 overflow-x-auto py-1 mb-5">
        <Button
          variant={selectedCategoryId === 'all' ? 'default-outline' : 'outline'}
          size="lg"
          onClick={() => setCagtegoryId('all')}>
          {selectedCategoryId === 'all' && <Check className="text-primary" />}
          All Categories
        </Button>
        {categories.map(category => (
          <Button
            key={category.id}
            size="lg"
            variant={selectedCategoryId === category.id ? 'default-outline' : 'outline'}
            onClick={() => setCagtegoryId(category.id)}
          >
            {selectedCategoryId === category.id && <Check className="text-primary" />}
            {category.name}
          </Button>
        ))}
      </div>

      <Input
        type="text"
        placeholder="Search products here..."
        className="mb-5 max-w-1/3"
        onChange={(e) => setQuery(e.target.value)}
      />


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No products found.</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Try a different search criteria.
          </p>
        </div>
      )}

    </div>
  )
}