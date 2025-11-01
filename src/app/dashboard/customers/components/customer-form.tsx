"use client"

import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../../../../../src-old/components/ui/button"
import { Input } from "../../../../../src-old/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../src-old/components/ui/form"
import { createCustomer, updateCustomer } from "../../../../../src-old/app/dashboard/server-actions/customer-actions"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { Customer } from "@prisma/client"

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface Props {
  customer?: Customer;
}

export default function CustomerForm({ customer }: Props) {
  const router = useRouter()
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
    },
    mode: "onTouched",
  })

  async function onSubmit(values: CustomerFormValues) {
    try {

      const data = {
        ...values,
        email: values.email ?? null,
        phone: values.phone ?? null
      }

      if (customer) {
        await updateCustomer({ ...data, id: customer.id })
        toast.success("Customer updated successfully ✅")
      } else {
        await createCustomer(data)
        toast.success("Customer created successfully ✅")
        form.reset()
      }

      router.push("/dashboard/customers")
      router.refresh()
    } catch {
      toast.error("Something went wrong ❌")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader className="animate-spin mr-2" /> Saving...
            </>
          ) : customer ? (
            "Update Customer"
          ) : (
            "Create Customer"
          )}
        </Button>
      </form>
    </Form>
  )
}
