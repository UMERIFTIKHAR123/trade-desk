"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Pagination } from "@/components/ui/pagination"

export function PaginationClient({
  currentPage,
  totalPages,
  view,
  search,
  categoryId
}: {
  currentPage: number
  totalPages: number
  view: string
  search: string
  categoryId: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    params.set("view", view)
    if (search) params.set("search", search)
    if (categoryId && categoryId !== "all") params.set("categoryId", categoryId)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )
}





