import DashboardLayout from "@/components/layouts/dashboard-layout";
import StatusBadge from "@/components/status-badge";
import DataTable from "@/components/tables/DataTable";
import {usePlans} from "@/hooks/training/use-plans";
import type {TrainingPlan} from "@/lib/api/interfaces/training.interface";
import {ColumnDef} from "@tanstack/react-table";
import {ReactElement, useEffect, useState} from "react";

/* ========================================
   = Columnas =
========================================= */
const columns: ColumnDef<TrainingPlan>[] = [
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
      <DataTable
        data={plans?.training_plans ?? []}
        columns={columns}
        isLoading={isLoading}
        pagination={plans ?? undefined}
        onPageChange={(page) => setParams((prev) => ({...prev, page}))}
        // Búsqueda
        onSearch={(search) => updateParams({search})}
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
