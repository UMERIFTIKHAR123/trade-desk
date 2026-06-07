import CustomerForm from "../components/customer-form"
import Link from "next/dist/client/link"


export default function NewCustomerPage() {
  return (
    <div className="p-6">
      <Link href="/dashboard/customers" className="text-blue-600 underline mb-4 block">
        ← Back to Customers
      </Link>
      <h2 className="text-xl font-bold mb-4">➕ New Customer</h2>
      <CustomerForm />
    </div>
  )
}
