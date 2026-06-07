"use client"

import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { Vendor } from "@prisma/client"
import { createVendor, updateVendor } from "../../server-actions/vendor-actions"
import { Card, CardContent } from "@/components/ui/card"

const vendorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
})

type VendorFormValues = z.infer<typeof vendorSchema>

interface Props {
  vendor?: Vendor;
}

export default function CustomerForm({ vendor }: Props) {
  const router = useRouter()
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: vendor?.name || "",
      email: vendor?.email || "",
      phone: vendor?.phone || "",
    },
    mode: "onTouched",
  })

  async function onSubmit(values: VendorFormValues) {
    try {

       const data = {
        ...values,
        email: values.email ?? null,
        phone: values.phone ?? null
      }

      let response;

      if (vendor) {
        response = await updateVendor({ ...data, id: vendor.id, })

      } else {
        response = await createVendor(data)

      }

      if (response.success) {
        toast.success(response.message)
        form.reset()
        router.push("/dashboard/vendors")
      } else {
        toast.error(response.message)
      }
    } catch {
      toast.error("Something went wrong ❌")
    }
  }

  return (
    <Card>

      <CardContent>
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
              ) : vendor ? (
                "Update Vendor"
              ) : (
                "Create Vendor"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
