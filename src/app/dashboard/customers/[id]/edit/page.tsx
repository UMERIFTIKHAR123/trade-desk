import prisma from "../../../../../../src-old/lib/prisma"
import { notFound } from "next/navigation"
import CustomerForm from "../../components/customer-form"
import { getCustomerUnique } from "@/lib/db/customers"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCustomerPage({ params }: Props) {
  const customerId = (await params).id

  const customer = await getCustomerUnique({
    where: { id: customerId },
  })

  if (!customer) {
    notFound()
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">✏️ Edit Customer</h2>
      <CustomerForm customer={customer} />
    </div>
  )
}
