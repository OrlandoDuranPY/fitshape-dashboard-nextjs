"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type Header,
} from "@tanstack/react-table";
import { Spinner } from "@/components/ui/spinner";
import { SearchXIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination, { type PaginationMeta } from "@/components/tables/Pagination";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

// ── Mobile card por fila ─────────────────────────────────────
function MobileRow<TData>({
  row,
  headers,
  isLast,
}: {
  row: Row<TData>;
  headers: Header<TData, unknown>[];
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const cells = row.getVisibleCells();
  const mainCells = cells.slice(0, 3);
  const extraCells = cells.slice(3);
  const hasExtra = extraCells.length > 0;

  return (
    <div
      className={cn(
        "px-4 py-3.5 transition-colors duration-150 hover:bg-muted/40",
        !isLast && "border-b border-border/60",
      )}
    >
      {/* Fila principal: primeras 3 columnas + toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          {/* Primera columna: nombre / valor principal */}
          <span className="font-semibold text-sm text-foreground font-heading truncate">
            {flexRender(mainCells[0].column.columnDef.cell, mainCells[0].getContext())}
          </span>

          {/* Segunda y tercera columna inline */}
          {mainCells.length > 1 && (
            <div className="flex items-center gap-3 flex-wrap">
              {mainCells.slice(1).map((cell) => (
                <span
                  key={cell.id}
                  className="text-xs text-muted-foreground font-heading"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </span>
              ))}
            </div>
          )}
        </div>

        {hasExtra && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 flex items-center justify-center size-7 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors duration-150"
            aria-label={expanded ? "Contraer" : "Expandir"}
          >
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform duration-300",
                expanded && "rotate-180",
              )}
            />
          </button>
        )}
      </div>

      {/* Columnas extra con animación grid-rows */}
      {hasExtra && (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-in-out",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2 pt-3 border-t border-border/40 mt-3">
              {extraCells.map((cell) => {
                const header = headers.find((h) => h.column.id === cell.column.id);
                return (
                  <div key={cell.id} className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-heading">
                      {header && !header.isPlaceholder
                        ? flexRender(header.column.columnDef.header, header.getContext())
                        : cell.column.id}
                    </span>
                    <span className="text-xs text-foreground font-heading">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── DataTable ────────────────────────────────────────────────
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
  });

  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups()[0]?.headers ?? [];

  const emptyState = (
    <div className="flex flex-col items-center gap-3 py-14">
      <div className="p-3 rounded-xl bg-muted text-muted-foreground">
        <SearchXIcon className="size-5" />
      </div>
      <p className="text-sm font-medium text-muted-foreground font-heading">
        {emptyMessage}
      </p>
    </div>
  );

  const loadingState = (
    <div className="flex justify-center py-16">
      <Spinner className="size-5 text-brand" />
    </div>
  );

  return (
    <div className="flex flex-col gap-3 font-heading">
      <div className="rounded-2xl border border-border bg-card-surface overflow-hidden shadow-sm">

        {/* ── Vista escritorio (md+) ── */}
        <div className="hidden md:block w-full overflow-x-auto">
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
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length}>{loadingState}</td>
                </tr>
              ) : rows.length ? (
                rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "transition-colors duration-150 hover:bg-muted/40",
                      rowIndex < rows.length - 1 && "border-b border-border/60",
                    )}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "py-3.5 px-5 align-middle whitespace-nowrap font-heading",
                          cellIndex === 0
                            ? "font-semibold text-foreground"
                            : "font-normal text-muted-foreground",
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length}>{emptyState}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Vista móvil (<md) ── */}
        <div className="md:hidden">
          {isLoading ? (
            loadingState
          ) : rows.length ? (
            rows.map((row, rowIndex) => (
              <MobileRow
                key={row.id}
                row={row}
                headers={headers}
                isLast={rowIndex === rows.length - 1}
              />
            ))
          ) : (
            emptyState
          )}
        </div>

      </div>
      {pagination && onPageChange && (
        <Pagination meta={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}
