import DashboardLayout from "@/components/layouts/dashboard-layout";
import LinkClientDialog from "@/components/training/link-client-dialog";
import DataTable from "@/components/tables/DataTable";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import MetricCard, {type MetricCardProps} from "@/components/ui/metric-card";
import Title from "@/components/ui/title";
import {useCoachClients} from "@/hooks/training/use-coach-clients";
import type {CoachClient} from "@/lib/api/interfaces/training.interface";
import {useAuthStore} from "@/lib/store/auth-store";
import {formatDate} from "@/lib/utils";
import {ColumnDef} from "@tanstack/react-table";
import {Users, UserCheck, UserX, Clock} from "lucide-react";
import {ReactElement, useCallback, useEffect, useMemo, useState} from "react";

/* ========================================
   = Helpers =
========================================= */
const statusConfig: Record<
  CoachClient["status"],
  {label: string; className: string}
> = {
  active: {
    label: "Activo",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  inactive: {
    label: "Inactivo",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  pending: {
    label: "Pendiente",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

/* ========================================
   = Table columns =
========================================= */
const clientColumn: ColumnDef<CoachClient> = {
  accessorKey: "user_name",
  header: "Cliente",
  cell: ({row}) => (
    <div>
      <p className='font-medium'>{row.original.user_name ?? "—"}</p>
      <p className='text-xs text-muted-foreground'>
        {row.original.user_email ?? ""}
      </p>
    </div>
  ),
};

const coachColumn: ColumnDef<CoachClient> = {
  accessorKey: "coach_name",
  header: "Entrenador",
  cell: ({row}) => (
    <div>
      <p className='font-medium'>{row.original.coach_name ?? "—"}</p>
      <p className='text-xs text-muted-foreground'>
        {row.original.coach_email ?? ""}
      </p>
    </div>
  ),
};

const baseColumns: ColumnDef<CoachClient>[] = [
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({getValue}) => {
      const status = getValue<CoachClient["status"]>();
      const config = statusConfig[status];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "start_date",
    header: "Inicio",
    cell: ({getValue}) => {
      const v = getValue<string | null>();
      return v ? formatDate(v) : "—";
    },
  },
  {
    accessorKey: "end_date",
    header: "Fin",
    cell: ({getValue}) => {
      const v = getValue<string | null>();
      return v ? formatDate(v) : "—";
    },
  },
  {
    accessorKey: "created_at",
    header: "Vinculado",
    cell: ({getValue}) => formatDate(getValue<string>()),
  },
];

/* ========================================
   = Params =
========================================= */
interface CoacheeParams {
  page: number;
  per_page: number;
  search?: string;
  status?: string;
}

/* ========================================
   = Page =
========================================= */
export default function Coachees() {
  const {isLoading, coachClients, getCoachClients} = useCoachClients();
  const currentUser = useAuthStore((s) => s.user);
  const isSuperAdmin = currentUser?.role === "super_admin";

  const columns = useMemo<ColumnDef<CoachClient>[]>(
    () =>
      isSuperAdmin
        ? [clientColumn, coachColumn, ...baseColumns]
        : [clientColumn, ...baseColumns],
    [isSuperAdmin],
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [params, setParams] = useState<CoacheeParams>({
    page: 1,
    per_page: 10,
  });

  const updateParams = (updates: Partial<CoacheeParams>) =>
    setParams((prev) => ({...prev, page: 1, ...updates}));

  const hasActiveFilters = !!(params.search || params.status);

  const handleClearFilters = () =>
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: undefined,
      status: undefined,
    }));

  const load = useCallback(() => {
    getCoachClients(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  /* ========================================
     = Metric cards =
  ========================================= */
  const clients = coachClients?.coach_clients ?? [];

  const cards: MetricCardProps[] = [
    {
      title: "Total clientes",
      value: coachClients?.total ?? 0,
      icon: Users,
    },
    {
      title: "Activos",
      value: clients.filter((c) => c.status === "active").length,
      icon: UserCheck,
      stat: {label: "en esta página", variant: "success"},
    },
    {
      title: "Inactivos",
      value: clients.filter((c) => c.status === "inactive").length,
      icon: UserX,
      stat: {label: "en esta página", variant: "warning"},
    },
    {
      title: "Pendientes",
      value: clients.filter((c) => c.status === "pending").length,
      icon: Clock,
      stat: {label: "en esta página", variant: "muted"},
    },
  ];

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <Title title='Clientes' level={2} />
        <Button onClick={() => setDialogOpen(true)}>
          <Users className='mr-2 h-4 w-4' />
          <span>Vincular cliente</span>
        </Button>
      </div>

      <LinkClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => getCoachClients(params)}
      />

      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        {cards.map((card, i) => (
          <MetricCard key={i} {...card} />
        ))}
      </div>

      <DataTable
        data={clients}
        columns={columns}
        isLoading={isLoading}
        pagination={coachClients ?? undefined}
        onPageChange={(page) => setParams((prev) => ({...prev, page}))}
        onSearch={(search) => updateParams({search: search || undefined})}
        searchValue={params.search ?? ""}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}

Coachees.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
