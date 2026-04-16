import DashboardLayout from "@/components/layouts/dashboard-layout";
import StatusBadge from "@/components/status-badge";
import DataTable from "@/components/tables/DataTable";
import {Button} from "@/components/ui/button";
import Title from "@/components/ui/title";
import {usePlans} from "@/hooks/training/use-plans";
import MetricCard, {type MetricCardProps} from "@/components/ui/metric-card";
import type {TrainingPlan} from "@/lib/api/interfaces/training.interface";
import {formatDate} from "@/lib/utils";
import {ROUTES} from "@/routing/routes";
import {ColumnDef} from "@tanstack/react-table";
import {Dumbbell, Plus, Users} from "lucide-react";
import {ReactElement, useEffect, useState} from "react";

/* ========================================
   = Variables =
========================================= */
const columns: ColumnDef<TrainingPlan>[] = [
  {
    accessorKey: "user_name",
    header: "Coachee",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "days_count",
    header: "Días",
  },
  {
    accessorKey: "is_active",
    header: "Activo",
    cell: ({getValue}) => <StatusBadge status={getValue<boolean>()} />,
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
    cell: ({getValue}) => formatDate(getValue<string>()),
  },
];

const cards: MetricCardProps[] = [
  {
    title: "Coachees/Clientes",
    value: 150,
    icon: Users,
    stat: {label: "+3 este mes", variant: "success"},
  },
  {
    title: "Planes creados este mes",
    value: 20,
    icon: Dumbbell,
    stat: {label: "+5 este mes", variant: "success"},
  },
  {
    title: "Planes activos",
    value: 20,
    icon: Dumbbell,
    stat: {label: "+5 este mes", variant: "success"},
  },
  {
    title: "Planes expirados",
    value: 20,
    icon: Dumbbell,
    stat: {label: "+5 este mes", variant: "warning"},
  },
];

/* ========================================
   = Tipos =
========================================= */
interface TrainingPlanParams {
  page: number;
  per_page: number;
  search?: string;
  user_uuid?: string;
  is_active?: boolean;
}

export default function Plans() {
  /* ========================================
     = Composables =
  ========================================= */
  const {isLoading, plans, getPlans} = usePlans();

  /* ========================================
     = States =
  ========================================= */
  const [params, setParams] = useState<TrainingPlanParams>({
    page: 1,
    per_page: 10,
  });

  useEffect(() => {
    getPlans(params);
  }, [params]);

  const updateParams = (updates: Partial<TrainingPlanParams>) =>
    setParams((prev) => ({...prev, page: 1, ...updates}));

  const hasActiveFilters = !!(
    params.search ||
    params.user_uuid ||
    params.is_active
  );

  const handleClearFilters = () => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: undefined,
      user_uuid: undefined,
      is_active: undefined,
    }));
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <Title title='Planes de entrenamiento' level={2} />
        <Button>
          <Plus /> <span>Nuevo plan</span>
        </Button>
      </div>

      <div>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
          {cards.map((card, index) => (
            <MetricCard key={index} {...card} />
          ))}
        </div>
      </div>

      <DataTable
        data={plans?.training_plans ?? []}
        columns={columns}
        isLoading={isLoading}
        pagination={plans ?? undefined}
        onPageChange={(page) => setParams((prev) => ({...prev, page}))}
        // Búsqueda
        onSearch={(search) => updateParams({search: search || undefined})}
        searchValue={params.search ?? ""}
        // Filtros
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      ></DataTable>
    </div>
  );
}

Plans.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
