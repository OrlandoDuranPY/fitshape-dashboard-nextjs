import DataTable from "@/components/tables/DataTable";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {useTraining} from "@/hooks/training/use-training";
import type {Exercise} from "@/lib/api/interfaces/training.interface";
import {ColumnDef} from "@tanstack/react-table";
import {ReactElement, useEffect, useState} from "react";

/* ========================================
   = Variables =
========================================= */
const columns: ColumnDef<Exercise>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "category",
    header: "Categoría",
  },
  {
    accessorKey: "is_bodyweight",
    header: "¿Peso corporal?",
    cell: ({row}) => (row.original.is_bodyweight ? "Sí" : "No"),
  },
  {
    accessorKey: "difficulty",
    header: "Dificultad",
  },
];

export default function Exercises() {
  const [page, setPage] = useState(1);

  const {isLoading, exercises, getExercices} = useTraining();

  useEffect(() => {
    getExercices({page});
  }, [page]);

  return (
    <div className="p-6">
      <DataTable
        data={exercises?.exercises ?? []}
        columns={columns}
        isLoading={isLoading}
        pagination={exercises ?? undefined}
        onPageChange={setPage}
      />
    </div>
  );
}

Exercises.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
