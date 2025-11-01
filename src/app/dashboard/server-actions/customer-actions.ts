"use server";

import { ServerActionResponse } from "../../../../src-old/app/types/server-action-response";
import prisma from "../../../../src-old/lib/prisma";
import { Customer } from "@prisma/client";
import { revalidateTag } from "next/cache";

type CreateCustomer = Omit<Customer, "id" | "createdAt" | "updatedAt">;

export async function createCustomer(data: CreateCustomer): Promise<ServerActionResponse<Customer>> {
  try {
    const customer = await prisma.customer.create({ data });

    revalidateTag("customers");
    revalidateTag("customerUnique")

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

    revalidateTag("customers");
    revalidateTag("customerUnique")

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

    revalidateTag("customers");
    revalidateTag("customerUnique")

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
