'use server'
import { ServerActionResponse } from "@/app/types/server-action-response";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

    revalidatePath('/dashboard/vendor-rates/management')

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

    revalidatePath("/dashboard/vendor-rates/management")

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