"use client"

import {
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  EllipsisIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  perPage?: number
  perPageOptions?: number[]
  onPerPageChange?: (value: number) => void
}

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

export default function Pagination({
  meta,
  onPageChange,
  perPage,
  perPageOptions = [10, 25, 50, 100],
  onPerPageChange,
}: PaginationProps) {
  const { current_page, last_page, total, per_page } = meta
  const from = total === 0 ? 0 : (current_page - 1) * per_page + 1
  const to = Math.min(current_page * per_page, total)
  const isFirst = current_page === 1
  const isLast = current_page === last_page
  const pages = buildPageWindow(current_page, last_page)

  return (
    <div className="grid grid-cols-3 items-center py-3 px-1 font-heading gap-2">

      {/* Izquierda: per_page */}
      <div className="flex items-center gap-2">
        {onPerPageChange && (
          <>
            <span className="hidden sm:block text-xs text-muted-foreground">Por página:</span>
            <Select
              value={String(perPage ?? perPageOptions[0])}
              onValueChange={(v) => onPerPageChange(Number(v))}
            >
              <SelectTrigger size="sm" className="w-16 font-heading text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)} className="font-heading text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      {/* Centro: contador de resultados */}
      <p className="hidden text-sm text-muted-foreground sm:block text-center">
        <span className="font-medium text-foreground">{from}–{to}</span>
        {" "}de{" "}
        <span className="font-medium text-foreground">{total}</span>
        {" "}resultados
      </p>

      {/* Derecha: botones de paginación */}
      <div className="flex items-center gap-1 justify-end">
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

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(current_page - 1)}
          disabled={isFirst}
          aria-label="Página anterior"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        {/* Móvil: pill compacto (ocupa el espacio de las 3 columnas) */}
        <div className="flex sm:hidden h-8 items-center gap-1 rounded-lg border border-border bg-muted/50 px-3 text-sm">
          <span className="font-medium text-foreground">{current_page}</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-muted-foreground">{last_page}</span>
        </div>

        {/* Desktop: ventana de páginas */}
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

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(current_page + 1)}
          disabled={isLast}
          aria-label="Página siguiente"
        >
          <ChevronRightIcon className="size-4" />
        </Button>

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
