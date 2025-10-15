import { ArrowLeft } from "lucide-react"
import VendorForm from "../components/vendor-form"
import Link from "next/dist/client/link"


export default function NewVendorPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <Link href="/dashboard/vendors">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Vendor</h1>
          <p className="text-gray-600">Add a new vendor</p>
        </div>
      </div>

      <VendorForm />
    </div>
  )
}
