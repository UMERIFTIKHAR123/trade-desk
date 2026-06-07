'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Category, Product, Vendor, VendorProductRate } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Package, TrendingUp } from "lucide-react";
import Image from "next/image";
import { DeleteRateDialog } from "./delete-rate-dialog";
import { EditRateDialog } from "./edit-rate-dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";


type ProductRatesTableProps = VendorProductRate & {
  product: Product & { category: Category };
  vendor: Vendor
};


const columns: ColumnDef<ProductRatesTableProps>[] = [
  {
    accessorKey: 'product.name',
    header: 'Product',
    cell: ({ row }) => {
      const product = row.original.product;

      return (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="font-medium">{product.name}</div>
        </div>
      )
    }
  },
  {
    accessorKey: 'product.category.name',
    header: 'Category'
  },
  {
    accessorKey: 'rate',
    header: 'Vendor Rate',
    cell: ({ row }) => `$${formatCurrency(row.original.rate)}`
  },
  {
    accessorKey: 'product.price',
    header: 'Retail Price',
  },
  {
    id: 'margin',
    header: 'Margin',
    cell: ({ row }) => {
      const { product, rate } = row.original;
      const margin = ((product.price - rate) / product.price) * 100;

      return (
        <div className="flex items-center gap-2">
          <Badge variant={"default"}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {margin.toFixed(1)}%
          </Badge>
        </div>
      )
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => formatDate(row.original.updatedAt)
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <EditRateDialog rate={row.original} />
          <DeleteRateDialog rateId={id} />
        </div>
      )
    }
  }
]

export function ProductRatesTable({ rates }: { rates: ProductRatesTableProps[] }) {

  const [searchTerm, setSearchTerm] = useState("");

  if (rates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No product rates yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start by adding product rates for this vendor. This will help you
            track pricing and make better purchasing decisions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const filteredProducts = rates.filter(rate => rate.product.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))

  return (
    <>
      <Field>
        <FieldLabel htmlFor="search">Search Product</FieldLabel>
        <Input
          id="search"
          autoComplete="off"
          placeholder="Entere product name here..."
          className="bg-white"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Field>

      <DataTable columns={columns} data={filteredProducts} />
    </>
  );
}