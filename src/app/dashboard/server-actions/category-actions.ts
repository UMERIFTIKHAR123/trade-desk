'use server';

import { ServerActionResponse } from '@/app/types/server-action-response';
import prisma from '@/lib/prisma';
import { Category } from '@prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

type CreateCategory = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;

export async function createCategory(data: CreateCategory): Promise<ServerActionResponse<null>> {

  try {

    const found = await prisma.category.findUnique({
      where: { name: data.name }
    })

    if (found) {
      return ({
        success: false,
        message: `Category already exists with name ${data.name}`,
        errors: { name: 'Category with this name already exists' },
      })
    }

    const category = await prisma.category.create({
      data,
    });

    revalidateTag("categories");
    // revalidatePath('/dashboard/categories')

    return {
      success: true,
      message: 'Category created successfully',
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Failed to create category',
      errors: { general: (error as Error).message },
    };
  }

}

export async function updateCategory(id: string, data: CreateCategory): Promise<ServerActionResponse<null>> {

  try {

    const found = await prisma.category.findUnique({
      where: { id }
    })

    if (!found) {
      return ({
        success: false,
        message: `Category not found with id ${id}`,
        errors: { name: 'Category not found' },
      })
    }

    await prisma.category.update({
      where: { id },
      data,
    });

    revalidateTag("categories");

    return {
      success: true,
      message: 'Category updated successfully',
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Failed to update category',
      errors: { general: (error as Error).message },
    };
  }

}

export async function deleteCategory(id: string): Promise<ServerActionResponse<null>> {

  try {

    await prisma.category.delete({
      where: { id }
    });

    revalidateTag("categories");

    return {
      success: true,
      message: 'Category deleted successfully',
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Failed to delete category',
      errors: { general: (error as Error).message },
    };
  }
}