'use server'
import { ServerActionResponse } from "@/app/types/server-action-response";
import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";

interface CreateVendorProductRate {
  vendorId: string;
  productId: string;
  rate: number;
}
export const addUpdateVendorProductRate = async (data: CreateVendorProductRate): Promise<ServerActionResponse<null>> => {
  const { vendorId, productId, rate } = data;
  try {
    await prisma.vendorProductRate.upsert({
      where: {
        vendorId_productId: {
          vendorId,
          productId
        }
      },
      update: {
        rate: data.rate
      },
      create: {
        vendorId,
        productId,
        rate
      }
    });

    updateTag('vendorProductsRates')

    return {
      success: true,
      message: 'Product rate added successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to add product rate'
    }
  }
}

export const deleteVendorRate = async (rateId: string): Promise<ServerActionResponse<null>> => {

  try {
    await prisma.vendorProductRate.delete({
      where: {
        id: rateId
      }
    });

    updateTag('vendorProductsRates')

    return {
      success: true,
      message: "Product rate deleted successfully"
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete product rate"
    }
  }
}