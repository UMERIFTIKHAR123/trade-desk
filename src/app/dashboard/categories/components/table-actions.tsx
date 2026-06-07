"use client";

import { Button } from "@/components/ui/button";
import { WarnAlertDialog } from "@/components/warn-alert-dialog";
import { deleteCategory } from "../../server-actions/category-actions";
import { toast } from "sonner";
import { Category } from "@prisma/client";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditCategoryModal } from "./edit-category-modal";

interface Props {
  category: Category;
}

export const TableActions = ({ category }: Props) => {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await deleteCategory(category.id);

    if (response.success) {
      toast.success(response.message);
      router.refresh();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div>
      <EditCategoryModal
        category={category}
        trigger={
          <Button variant="outline" size="sm" className="mr-2">
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
        }
      />

      <WarnAlertDialog
        title="Delete category?"
        description={`Do you really want to delete "${category.name}"? This action cannot be undone.`}
        confirmBtnTitle="Delete"
        triggerElement={
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        }
        onConfirm={handleDelete}
      />
    </div>
  );
};
