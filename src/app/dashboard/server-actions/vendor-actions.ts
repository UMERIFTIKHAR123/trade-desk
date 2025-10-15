"use server";

import { ServerActionResponse } from "@/app/types/server-action-response";
import prisma from "@/lib/prisma";
import { Vendor } from "@prisma/client";
import { revalidatePath } from "next/cache";

type CreateVendor = Omit<Vendor, "id" | "createdAt" | "updatedAt">;

export async function createVendor(data: CreateVendor): Promise<ServerActionResponse<Vendor>> {
  try {
    const vendor = await prisma.vendor.create({ data });

    revalidatePath("/dashboard/vendors");
    return {
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create vendor",
      errors: { general: (error as Error).message },
    };
  }
}

type UpdateVendor = Omit<Vendor, "createdAt" | "updatedAt">;

export async function updateVendor(data: UpdateVendor): Promise<ServerActionResponse<Vendor>> {
  try {
    const vendor = await prisma.vendor.update({
      where: { id: data.id },
      data,
    });

    return {
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update vendor",
      errors: { general: (error as Error).message },
    };
  }
}

export async function deleteVendor(id: string): Promise<ServerActionResponse<null>> {
  try {
    await prisma.vendor.delete({ where: { id } });
    revalidatePath("/dashboard/vendors");

    return {
      success: true,
      message: "Vendor deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete vendor",
      errors: { general: (error as Error).message },
    };
  }
}
