"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { Spinner } from "@/components/ui/spinner"
import { SearchXIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Pagination, { type PaginationMeta } from "@/components/tables/Pagination"

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  pagination?: PaginationMeta
  onPageChange?: (page: number) => void
  isLoading?: boolean
  emptyMessage?: string
}

export default function DataTable<TData>({
  data,
  columns,
  pagination,
  onPageChange,
  isLoading = false,
  emptyMessage = "No hay resultados.",
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-3 font-heading">
      <div className="rounded-2xl border border-border bg-card-surface overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm font-heading">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-11 px-5 text-left align-middle text-xs font-semibold uppercase tracking-widest text-muted-foreground font-heading whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="flex justify-center py-16">
                      <Spinner className="size-5 text-brand" />
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "transition-colors duration-150 hover:bg-muted/40",
                      rowIndex < table.getRowModel().rows.length - 1 && "border-b border-border/60"
                    )}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "py-3.5 px-5 align-middle whitespace-nowrap font-heading",
                          cellIndex === 0
                            ? "font-semibold text-foreground"
                            : "font-normal text-muted-foreground"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="flex flex-col items-center gap-3 py-14">
                      <div className="p-3 rounded-xl bg-muted text-muted-foreground">
                        <SearchXIcon className="size-5" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground font-heading">
                        {emptyMessage}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {pagination && onPageChange && (
        <Pagination meta={pagination} onPageChange={onPageChange} />
      )}
    </div>
  )
}
