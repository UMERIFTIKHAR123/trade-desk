import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search } from "lucide-react";
import { getCategories } from "@/lib/db/categories";

export function SearchAndFilters({
  search,
  categoryId
}: {
  search: string;
  categoryId: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          type="search"
          name="search"
          placeholder="Search products..."
          defaultValue={search}
          className="w-full"
        />
      </div>
      <CategoryFilter categoryId={categoryId} />
      <Button type="submit">
        <Search className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  );
}

async function CategoryFilter({ categoryId }: { categoryId: string }) {
  const categories = await getCategories();

  return (
    <Select name="categoryId" defaultValue={categoryId || "all"}>
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
  );
}
