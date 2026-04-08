"use client"

import {
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  EllipsisIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
  next_page_url: string | null
  prev_page_url: string | null
}

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
}

/**
 * Builds the page window to display:
 * Always shows first and last. Shows delta=2 pages on each side of current.
 * Inserts "ellipsis" where there are gaps.
 *
 * Examples (current=5, last=20): [1, ellipsis, 3, 4, 5, 6, 7, ellipsis, 20]
 * Examples (current=2, last=20): [1, 2, 3, 4, ellipsis, 20]
 */
function buildPageWindow(current: number, last: number): (number | "ellipsis")[] {
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }

  const delta = 2
  const rangeStart = Math.max(2, current - delta)
  const rangeEnd = Math.min(last - 1, current + delta)

  const middle: number[] = []
  for (let i = rangeStart; i <= rangeEnd; i++) {
    middle.push(i)
  }

  const pages: (number | "ellipsis")[] = [1]
  if (rangeStart > 2) pages.push("ellipsis")
  pages.push(...middle)
  if (rangeEnd < last - 1) pages.push("ellipsis")
  pages.push(last)

  return pages
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { current_page, last_page, total, per_page } = meta

  const from = total === 0 ? 0 : (current_page - 1) * per_page + 1
  const to = Math.min(current_page * per_page, total)
  const isFirst = current_page === 1
  const isLast = current_page === last_page
  const pages = buildPageWindow(current_page, last_page)

  return (
    <div className="flex items-center justify-between py-3 px-1">
      {/* Results range */}
      <p className="hidden text-sm text-muted-foreground sm:block">
        <span className="font-heading font-medium text-foreground">
          {from}–{to}
        </span>{" "}
        de{" "}
        <span className="font-heading font-medium text-foreground">
          {total}
        </span>{" "}
        resultados
      </p>

      <div className="flex items-center gap-1 ml-auto sm:ml-0">
        {/* First page — desktop only */}
        <Button
          variant="outline"
          size="icon"
          className="hidden lg:flex"
          onClick={() => onPageChange(1)}
          disabled={isFirst}
          aria-label="Primera página"
        >
          <ChevronsLeftIcon className="size-4" />
        </Button>

        {/* Prev */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(current_page - 1)}
          disabled={isFirst}
          aria-label="Página anterior"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        {/* Mobile: compact current/total pill */}
        <div className="flex sm:hidden h-8 items-center gap-1 rounded-lg border border-border bg-muted/50 px-3 text-sm">
          <span className="font-heading font-medium text-foreground">
            {current_page}
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="font-heading font-medium text-muted-foreground">
            {last_page}
          </span>
        </div>

        {/* Desktop: full page window */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((page, i) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${i}`}
                className="flex size-8 items-center justify-center text-muted-foreground"
                aria-hidden
              >
                <EllipsisIcon className="size-4" />
              </span>
            ) : (
              <Button
                key={page}
                variant={page === current_page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                aria-label={`Página ${page}`}
                aria-current={page === current_page ? "page" : undefined}
              >
                {page}
              </Button>
            )
          )}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(current_page + 1)}
          disabled={isLast}
          aria-label="Página siguiente"
        >
          <ChevronRightIcon className="size-4" />
        </Button>

        {/* Last page — desktop only */}
        <Button
          variant="outline"
          size="icon"
          className="hidden lg:flex"
          onClick={() => onPageChange(last_page)}
          disabled={isLast}
          aria-label="Última página"
        >
          <ChevronsRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
