import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src-old/components/ui/table"

import { TableActions } from "./components/table-actions";
import { Button } from "../../../../src-old/components/ui/button";
import Link from "next/link";
import { Boxes, Plus } from "lucide-react";
import { getCategories } from "@/lib/db/categories";


export default async function CategoryPage() {

  const categories = await getCategories();

  return (
    <div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex "><Boxes size={34} className="mr-2 self-end" /> Product's Categories</h1>
          <p className="text-muted-foreground">
            Manage categories
          </p>
        </div>
        <div className="flex items-center gap-3">

          <Button asChild size="lg">
            <Link href="/dashboard/categories/new">
              <Plus className="h-5 w-5 mr-2" />
              Add Category
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-muted/50">
                <TableCell>{category.name}</TableCell>

                <TableCell className="text-right">
                  <TableActions category={category} />
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </div>


    </div>
  )
}
