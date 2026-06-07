"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function SearchAndFiltersClient({
  search: initialSearch,
  categoryId: initialCategoryId,
  categories
}: {
  search: string;
  categoryId: string;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const debouncedSearch = useDebounce(search, 500);
  const isInitialMount = useRef(true);
  const prevSearchRef = useRef(initialSearch);
  const prevCategoryRef = useRef(initialCategoryId);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSearchRef.current = debouncedSearch;
      prevCategoryRef.current = categoryId;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const view = params.get("view") || "grid";

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (categoryId && categoryId !== "all") {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }

    params.set("view", view);
    // Reset to page 1 when search/filter changes
    if (debouncedSearch !== prevSearchRef.current || categoryId !== prevCategoryRef.current) {
      params.set("page", "1");
    }
    
    prevSearchRef.current = debouncedSearch;
    prevCategoryRef.current = categoryId;
    
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(newUrl, { scroll: false });
  }, [debouncedSearch, categoryId, router, searchParams]);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Select value={categoryId} onValueChange={setCategoryId}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

