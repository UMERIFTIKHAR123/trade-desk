import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog | Tag Trading",
  description: "Browse our product categories and collections.",
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3e8df] text-[#2d2a26]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {children}
      </div>
    </div>
  );
}
