import { notFound } from "next/navigation";
import CategoryForm from "../../category-form";
import { getCategoryUnique } from "@/lib/db/categories";

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: Props) {

  const categoryId = (await params).id


  const found = await getCategoryUnique({
    where: { id: categoryId }
  })

  if (!found) {
    notFound();
  }


  return <div className="p-6">
    <h2 className="text-xl font-bold mb-4">Edit Category</h2>

    <CategoryForm category={found} />

  </div>
}