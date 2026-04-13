"use client";

import {useState, useEffect, useRef, type ReactNode} from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type Header,
} from "@tanstack/react-table";
import {Spinner} from "@/components/ui/spinner";
import {
  SearchXIcon,
  ChevronDownIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import Pagination, {type PaginationMeta} from "@/components/tables/Pagination";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  // Búsqueda
  onSearch?: (value: string) => void;
  searchValue?: string; // valor controlado externamente (para reset)
  // Slot libre para filtros extra
  filters?: ReactNode;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  // Registros por página (se pasan a Pagination)
  perPage?: number;
  perPageOptions?: number[];
  onPerPageChange?: (value: number) => void;
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
  const mainCells = cells.slice(0, 2);
  const extraCells = cells.slice(2);
  const hasExtra = extraCells.length > 0;

  return (
    <div
      className={cn(
        "px-4 py-3.5 transition-colors duration-150 hover:bg-muted/40",
        !isLast && "border-b border-border/60",
      )}
    >
      <div className='flex items-center justify-between gap-3'>
        <div className='flex flex-col gap-1.5 min-w-0'>
          {mainCells.map((cell, i) => {
            const header = headers.find((h) => h.column.id === cell.column.id);
            return (
              <div
                key={cell.id}
                className='flex items-center gap-1.5 font-heading min-w-0'
              >
                {header && !header.isPlaceholder && (
                  <span className='text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 shrink-0'>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    :
                  </span>
                )}
                <span
                  className={cn(
                    "font-heading truncate",
                    i === 0
                      ? "text-sm font-semibold text-foreground"
                      : "text-xs text-muted-foreground font-normal",
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </span>
              </div>
            );
          })}
        </div>

        {hasExtra && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className='shrink-0 flex items-center justify-center size-7 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors duration-150'
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

      {hasExtra && (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-in-out",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className='overflow-hidden'>
            <div className='flex flex-col gap-2 pt-3 border-t border-border/40 mt-3'>
              {extraCells.map((cell) => {
                const header = headers.find(
                  (h) => h.column.id === cell.column.id,
                );
                return (
                  <div
                    key={cell.id}
                    className='flex items-center justify-between gap-2'
                  >
                    <span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground font-heading'>
                      {header && !header.isPlaceholder
                        ? flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        : cell.column.id}
                      :
                    </span>
                    <span className='text-xs text-foreground font-heading'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
const DEFAULT_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function DataTable<TData>({
  data,
  columns,
  pagination,
  onPageChange,
  isLoading = false,
  emptyMessage = "No hay resultados.",
  onSearch,
  searchValue,
  filters,
  hasActiveFilters = false,
  onClearFilters,
  perPage,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
  onPerPageChange,
}: DataTableProps<TData>) {
  const [searchInput, setSearchInput] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Sincroniza el buscador cuando el padre resetea searchValue
  const isExternalReset = useRef(false);
  useEffect(() => {
    if (searchValue !== undefined && searchValue !== searchInput) {
      isExternalReset.current = true;
      setSearchInput(searchValue);
    }
  }, [searchValue]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isExternalReset.current) {
      isExternalReset.current = false;
      return;
    }
    const timer = setTimeout(() => onSearchRef.current?.(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups()[0]?.headers ?? [];
  const hasSearch = !!onSearch;
  const hasFilters = !!filters;
  const hasToolbar = hasSearch || hasFilters;

  const emptyState = (
    <div className='flex flex-col items-center gap-3 py-14'>
      <div className='p-3 rounded-xl bg-muted text-muted-foreground'>
        <SearchXIcon className='size-5' />
      </div>
      <p className='text-sm font-medium text-muted-foreground font-heading'>
        {emptyMessage}
      </p>
    </div>
  );

  const loadingState = (
    <div className='flex justify-center py-16'>
      <Spinner className='size-5 text-brand' />
    </div>
  );

  const searchInput_ = (
    <div className='relative flex-1 min-w-48'>
      <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none' />
      <Input
        placeholder='Buscar...'
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className='pl-8 text-sm'
      />
    </div>
  );

  return (
    <div className='flex flex-col gap-3 font-heading'>
      <div className='rounded-2xl border border-border bg-card-surface overflow-hidden'>
        {/* ── Toolbar desktop (md+): filtros inline + búsqueda ── */}
        {hasToolbar && (
          <div className='hidden md:flex flex-wrap items-center gap-2 p-3 border-b border-border/60'>
            {hasFilters && (
              <div className='flex items-center gap-2 flex-wrap'>{filters}</div>
            )}
            {hasActiveFilters && onClearFilters && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onClearFilters}
                className='h-8 gap-1.5 font-heading text-xs text-muted-foreground hover:text-foreground'
              >
                <XIcon className='size-3.5' />
                Limpiar filtros
              </Button>
            )}
            {hasSearch && searchInput_}
          </div>
        )}

        {/* ── Toolbar móvil (<md): búsqueda + botón filtros ── */}
        {hasToolbar && (
          <div className='md:hidden flex items-center gap-2 p-3 border-b border-border/60'>
            {hasSearch && searchInput_}
            {hasFilters && (
              <Button
                variant='outline'
                size='sm'
                className='shrink-0 h-8 gap-1.5 font-heading text-xs'
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontalIcon className='size-3.5' />
                Filtros
              </Button>
            )}
          </div>
        )}

        {/* ── Vista escritorio (md+) ── */}
        <div className='hidden md:block w-full overflow-x-auto'>
          <table className='w-full text-sm font-heading'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className='border-b border-border bg-muted/50'
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className='h-11 px-5 text-left align-middle text-xs font-semibold uppercase tracking-widest text-muted-foreground font-heading whitespace-nowrap'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
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
        <div className='md:hidden'>
          {isLoading
            ? loadingState
            : rows.length
              ? rows.map((row, rowIndex) => (
                  <MobileRow
                    key={row.id}
                    row={row}
                    headers={headers}
                    isLast={rowIndex === rows.length - 1}
                  />
                ))
              : emptyState}
        </div>
      </div>

      {pagination && onPageChange && (
        <Pagination
          meta={pagination}
          onPageChange={onPageChange}
          perPage={perPage}
          perPageOptions={perPageOptions}
          onPerPageChange={onPerPageChange}
        />
      )}

      {/* ── Drawer filtros móvil ── */}
      {hasFilters && (
        <Drawer
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          direction='bottom'
        >
          <DrawerContent>
            <DrawerHeader className='flex flex-row items-center justify-between'>
              <DrawerTitle>Filtros</DrawerTitle>
              <DrawerClose asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='font-heading text-xs'
                >
                  Cerrar
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className='flex flex-col gap-4 p-4 pt-0'>{filters}</div>
            {hasActiveFilters && onClearFilters && (
              <DrawerFooter className='pt-0'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    onClearFilters();
                    setFiltersOpen(false);
                  }}
                  className='w-full gap-1.5 font-heading text-xs'
                >
                  <XIcon className='size-3.5' />
                  Limpiar filtros
                </Button>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
