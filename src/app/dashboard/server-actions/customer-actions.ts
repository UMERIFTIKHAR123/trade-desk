"use server";

import { ServerActionResponse } from "@/app/types/server-action-response";
import prisma from "@/lib/prisma";
import { Customer } from "@prisma/client";
import { revalidatePath } from "next/cache";

type CreateCustomer = Omit<Customer, "id" | "createdAt" | "updatedAt">;

export async function createCustomer(data: CreateCustomer): Promise<ServerActionResponse<Customer>> {
  try {
    const customer = await prisma.customer.create({ data });

    return {
      success: true,
      message: "Customer created successfully",
      data: customer,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create customer",
      errors: { general: (error as Error).message },
    };
  }
}

type UpdateCustomer = Omit<Customer, "createdAt" | "updatedAt">;

export async function updateCustomer(data: UpdateCustomer): Promise<ServerActionResponse<Customer>> {
  try {
    const customer = await prisma.customer.update({
      where: { id: data.id },
      data,
    });

    return {
      success: true,
      message: "Customer updated successfully",
      data: customer,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update customer",
      errors: { general: (error as Error).message },
    };
  }
}

export async function deleteCustomer(id: string): Promise<ServerActionResponse<null>> {
  try {
    await prisma.customer.delete({ where: { id } });
    revalidatePath("/dashboard/customers");

    return {
      success: true,
      message: "Customer deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete customer",
      errors: { general: (error as Error).message },
    };
  }
}
