import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import VendorForm from "../../components/vendor-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCustomerPage({ params }: Props) {
  const vendorId = (await params).id

  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  })

  if (!vendor) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-5">
        <Link href="/dashboard/vendors">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Vendor</h1>
          <p className="text-gray-600">Update vendor details</p>
        </div>
      </div>
      <VendorForm vendor={vendor} />
    </div>
  )
}
