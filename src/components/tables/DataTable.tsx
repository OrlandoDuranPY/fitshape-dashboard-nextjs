"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
    <div className="flex flex-col gap-2">
      <div className="rounded-xl border border-gray/20 bg-card-surface text-card-foreground overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-muted border-b-2 border-border"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-heading font-medium text-xs uppercase tracking-wider text-muted-foreground h-10"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length}>
                  <div className="flex justify-center py-16">
                    <Spinner className="size-6 text-brand" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-l-2 border-l-transparent hover:border-l-brand hover:bg-brand/5 transition-colors"
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "text-sm py-3",
                        cellIndex === 0
                          ? "font-medium text-card-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col items-center gap-3 py-12">
                    <div className="p-3 rounded-xl bg-brand/10 text-brand">
                      <SearchXIcon className="size-5" />
                    </div>
                    <p className="text-sm font-heading font-medium text-muted-foreground">
                      {emptyMessage}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && onPageChange && (
        <Pagination meta={pagination} onPageChange={onPageChange} />
      )}
    </div>
  )
}
