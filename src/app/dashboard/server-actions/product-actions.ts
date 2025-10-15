'use server';

import { ServerActionResponse } from '@/app/types/server-action-response';
import prisma from '@/lib/prisma';
import { Product } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { del } from '@vercel/blob';

type CreateProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'| 'isDeleted'>;

export async function createProduct(data: CreateProduct): Promise<ServerActionResponse<Product>> {

  try {

    const product = await prisma.product.create({
      data,
    });

    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };

  } catch (error) {
    return {
      success: false,
      message: 'Failed to create product',
      errors: { general: (error as Error).message },
    };
  }
}


type UpdateProduct = Omit<Product, 'createdAt' | 'updatedAt' | 'isDeleted'>;

export async function updateProduct(data: UpdateProduct, isImageReplaced?: boolean): Promise<ServerActionResponse<Product>> {

  try {

    if (isImageReplaced) {
      const product = await prisma.product.findUnique({
        where: { id: data.id },
        select: { imagePath: true }
      });
      if (product?.imagePath) {
        await del(product.imagePath);
      }
    }

    const { categoryId, ...dataWithoutCategoryId } = data;

    const product = await prisma.product.update({
      where: { id: data.id },
      data: {
        ...dataWithoutCategoryId,
        category: {
          connect: { id: categoryId }
        }
      },
    });

    return {
      success: true,
      message: 'Product updated successfully',
      data: product,
    };

  } catch (error) {
    return {
      success: false,
      message: 'Failed to update product',
      errors: { general: (error as Error).message },
    };
  }

}


export async function deleteProduct(id: string): Promise<ServerActionResponse<null>> {
  try {

    const productExistedInSomePO = await prisma.product.findFirst({
      where: {
        PurchaseOrderItem: {
          some: {
            productId: id
          }
        }
      }
    });

    if (productExistedInSomePO) {
      await prisma.product.update({
        where: { id },
        data: { isDeleted: true }
      });
    } else {
      await prisma.product.delete({
        where: { id }
      });
    }

    revalidatePath('/dashboard/product')

    return {
      success: true,
      message: 'Product is deleted successfully',
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Failed to delete product',
      errors: { general: (error as Error).message },
    };
  }
}