'use client'

import { Button } from "../../../../../src-old/components/ui/button"
import { deleteCategory } from "../../server-actions/category-actions"
import { toast } from "sonner"
import { Category } from "@prisma/client"
import Link from "next/link"
import { Edit, Trash2 } from "lucide-react"


interface Props {
  category: Category;
}

export const TableActions = ({ category }: Props) => {


  const handleDelete = async (id: string) => {

    const response = await deleteCategory(id);

    if (response.success) {
      toast.success("Category deleted successfully")
    } else {
      toast.error("Category deleted successfully")
    }
  }


  return <div>
    <Link href={`/dashboard/categories/${category.id}/edit`}>
      <Button
        variant="outline"
        size="sm"
        className="mr-2"
      >
        <Edit className="h-4 w-4 mr-2" /> Edit
      </Button>
    </Link>


    <Button
      variant="destructive"
      size="sm"
      onClick={() => handleDelete(category.id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
} 