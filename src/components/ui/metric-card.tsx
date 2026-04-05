import {LucideIcon, ArrowRight} from "lucide-react";
import {Card} from "./card";
import {Badge} from "./badge";
import Link from "next/link";
import {cn} from "@/lib/utils";
import Title from "./title";

/* ========================================
   = Types =
========================================= */

type StatVariant = "brand" | "success" | "warning" | "muted";

interface StatConfig {
  label: string;
  variant?: StatVariant;
}

export interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconSize?: number;
  path?: string;
  pathText?: string;
  stat?: StatConfig;
  highlight?: boolean;
}

/* ========================================
   = Helpers =
========================================= */

const statClasses: Record<StatVariant, string> = {
  brand: "bg-brand/10 text-brand border-brand/20",
  success:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  muted: "bg-muted text-muted-foreground border-transparent",
};

/* ========================================
   = Component =
========================================= */

export default function MetricCard({
  title,
  value,
  icon: Icon,
  iconSize = 18,
  path,
  pathText,
  stat,
  highlight = false,
}: MetricCardProps) {

  return (
    <Card>
      {/* Top row: title + icon */}
      <div className='flex items-start justify-between gap-2 px-4'>
        <Title level={5} title={title} className='text-foreground' />
        <div className='shrink-0 p-2 rounded-lg bg-brand/10 text-brand'>
          <Icon size={iconSize} />
        </div>
      </div>

      {/* Value */}
      <div className='px-4'>
        <span
          className={cn(
            "font-heading font-bold text-3xl tracking-tight transition-colors",
            highlight ? "text-brand" : "text-foreground",
          )}
        >
          {value}
        </span>
      </div>

      {/* Bottom row: stat badge + link */}
      {(stat || (path && pathText)) && (
        <div className='flex items-center justify-between gap-2 px-4'>
          {stat && (
            <Badge
              className={cn(
                "border text-xs",
                statClasses[stat.variant ?? "muted"],
              )}
            >
              {stat.label}
            </Badge>
          )}
          {path && pathText && (
            <Link
              href={path}
              className='ml-auto flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-brand transition-colors'
            >
              {pathText}
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      )}
    </Card>
  );
}
