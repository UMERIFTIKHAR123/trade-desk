'use server';

import { PurchaseOrder, PurchaseOrderItem } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ServerActionResponse } from "@/app/types/server-action-response";
import { revalidatePath } from "next/cache";

type CreatePurchaseOrder = { customerId: string; items: Omit<PurchaseOrderItem, 'id' | 'purchaseOrderId' | 'createdAt' | 'updatedAt'>[] }

export const createPurchaseOrder = async (data: CreatePurchaseOrder): Promise<ServerActionResponse<PurchaseOrder>> => {

  const totalAmounts = data.items.reduce((acc, current) => {

    const price = current.unitPrice;
    const units = current.quantity;
    const iva = current.iva / 100;
    const dto = current.dto / 100;
    const rowTotal = (price * units) * (1 - dto) * (1 + iva);

    return ({ total: acc.total + rowTotal })

  }, { total: 0 })

  try {

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        customerId: data.customerId,
        totalAmount: totalAmounts.total,
        items: {
          create: data.items
        },
      }
    });

    revalidatePath('/dashboard/purchase-orders');

    return {
      success: true,
      message: 'Purchase order created successfully',
      data: purchaseOrder
    };


  } catch (error) {
    return {
      success: false,
      message: 'Failed to create purchase order',
      errors: { general: (error as Error).message },
    };
  }

};

export const updatePurchaseOrder = async (id: string, data: CreatePurchaseOrder): Promise<ServerActionResponse<PurchaseOrder>> => {

  const totalAmounts = data.items.reduce((acc, current) => {

    const price = current.unitPrice;
    const units = current.quantity;
    const iva = current.iva / 100;
    const dto = current.dto / 100;
    const rowTotal = (price * units) * (1 - dto) * (1 + iva);

    return ({ total: acc.total + rowTotal })

  }, { total: 0 })

  try {

    // First, delete existing items
    await prisma.purchaseOrderItem.deleteMany({
      where: { purchaseOrderId: id }
    });

    // Then, update the purchase order and create new items
    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        customerId: data.customerId,
        totalAmount: totalAmounts.total,
        items: {
          create: data.items
        },
      }
    });

    revalidatePath('/dashboard/purchase-orders');

    return {
      success: true,
      message: 'Purchase order updated successfully',
      data: purchaseOrder
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update purchase order',
      errors: { general: (error as Error).message },
    };
  }
}

export const deletePurchaseOrder = async (id: string): Promise<ServerActionResponse<null>> => {
  try {
    // First, delete associated items
    await prisma.purchaseOrderItem.deleteMany({
      where: { purchaseOrderId: id }
    });

    // Then, delete the purchase order
    await prisma.purchaseOrder.delete({
      where: { id }
    });

    revalidatePath('/dashboard/purchase-orders');

    return {
      success: true,
      message: 'Purchase order deleted successfully',
      data: null
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete purchase order',
      errors: { general: (error as Error).message },
    };
  }
}
