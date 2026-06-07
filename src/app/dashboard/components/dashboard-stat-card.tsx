import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  footer: React.ReactNode;
  icon: LucideIcon;
  href: string;
  iconClassName?: string;
  iconBgClassName?: string;
}

export function DashboardStatCard({
  title,
  value,
  footer,
  icon: Icon,
  href,
  iconClassName,
  iconBgClassName,
}: DashboardStatCardProps) {
  return (
    <Link href={href} className="group block h-full min-w-0">
      <div className="flex h-full min-w-0 flex-col rounded-xl border bg-card p-3 shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md sm:p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              iconBgClassName,
            )}
          >
            <Icon className={cn("h-4 w-4", iconClassName)} />
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary" />
        </div>

        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {value}
          </p>
          <p className="truncate text-xs text-muted-foreground">{title}</p>
        </div>

        <div className="mt-3 min-w-0 border-t pt-3 text-[11px] leading-snug text-muted-foreground sm:text-xs">
          <div className="line-clamp-2">{footer}</div>
        </div>
      </div>
    </Link>
  );
}
