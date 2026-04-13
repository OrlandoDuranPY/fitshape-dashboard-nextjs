import {ReactElement, useEffect, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import DataTable from "@/components/tables/DataTable";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {useTraining} from "@/hooks/training/use-training";
import type {Exercise} from "@/lib/api/interfaces/training.interface";
import SelectComponent from "@/components/forms/inputs/select-component";

/* ── Columnas ─────────────────────────────────────────────── */
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

/* ── Tipos ────────────────────────────────────────────────── */
interface ExerciseParams {
  page: number;
  per_page: number;
  search?: string;
  category_id?: number;
  difficulty?: string;
}

/* ── Página ───────────────────────────────────────────────── */
export default function Exercises() {
  const {isLoading, exercises, getExercices} = useTraining();

  const [params, setParams] = useState<ExerciseParams>({
    page: 1,
    per_page: 10,
  });

  useEffect(() => {
    getExercices(params);
  }, [params]);

  const updateParams = (updates: Partial<ExerciseParams>) =>
    setParams((prev) => ({...prev, page: 1, ...updates}));

  return (
    <div>
      <DataTable
        data={exercises?.exercises ?? []}
        columns={columns}
        isLoading={isLoading}
        pagination={exercises ?? undefined}
        onPageChange={(page) => setParams((prev) => ({...prev, page}))}
        // Búsqueda
        onSearch={(search) => updateParams({search})}
        // Filtros extra
        filters={
          <>
            {/* Dificultad */}
            <SelectComponent
              name='difficulty'
              placeholder='Dificultad'
              value={params.difficulty ?? ""}
              onChange={(v) => updateParams({difficulty: v || undefined})}
              clearable
              options={[
                {value: "beginner", label: "Principiante"},
                {value: "intermediate", label: "Intermedio"},
                {value: "expert", label: "Experto"},
              ]}
            />

            {/* category_id: agregar cuando tengas el endpoint de categorías
            <Select
              value={String(params.category_id ?? "")}
              onValueChange={(v) =>
                updateParams({ category_id: v === "all" ? undefined : Number(v) })
              }
            >
              <SelectTrigger size="sm" className="w-36 font-heading text-xs">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            */}
          </>
        }
        // Registros por página
        perPage={params.per_page}
        onPerPageChange={(per_page) => updateParams({per_page})}
      />
    </div>
  );
}

Exercises.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
