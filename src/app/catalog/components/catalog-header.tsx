import Link from "next/link";

type CatalogHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
};

export function CatalogHeader({
  title,
  subtitle,
  backHref,
  backLabel = "All Categories",
}: CatalogHeaderProps) {
  return (
    <header className="mb-10 text-center">
      <Link
        href="/catalog"
        className="mb-6 inline-block text-sm font-semibold uppercase tracking-[0.35em] text-[#8a7b6f] transition-colors hover:text-[#5c4f45]"
      >
        Tag Trading
      </Link>

      {backHref ? (
        <div className="mb-4">
          <Link
            href={backHref}
            className="text-sm text-[#8a7b6f] underline-offset-4 hover:text-[#5c4f45] hover:underline"
          >
            ← {backLabel}
          </Link>
        </div>
      ) : null}

      <h1 className="text-3xl font-bold uppercase tracking-wide text-[#2d2a26] sm:text-4xl">
        {title}
      </h1>

      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#8a7b6f] sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
