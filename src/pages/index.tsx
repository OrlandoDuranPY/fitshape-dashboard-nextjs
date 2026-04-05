import DashboardLayout from "@/components/layouts/dashboard-layout";
import MetricCard, {type MetricCardProps} from "@/components/ui/metric-card";
import {ROUTES} from "@/routing/routes";
import {Beef, Dumbbell, SportShoe} from "lucide-react";
import {ReactElement} from "react";

const cards: MetricCardProps[] = [
  {
    title: "Rutinas creadas este mes",
    value: 10,
    icon: Dumbbell,
    path: ROUTES.training.routines,
    pathText: "Ir a rutinas",
    stat: {label: "5 rutinas pendientes", variant: "warning"},
  },
  {
    title: "Sesiones de entrenamiento esta semana",
    value: 3,
    icon: SportShoe,
    path: ROUTES.training.routines,
    pathText: "Ir a rutinas",
    stat: {label: "3/10 completadas", variant: "warning"},
  },
  {
    title: "Planes alimenticios creados este mes",
    value: 20,
    icon: Beef,
    path: ROUTES.training.routines,
    pathText: "Ir a rutinas",
    stat: {label: "+5 este mes", variant: "success"},
  },
  {
    title: "Rutinas pendientes",
    value: 5,
    icon: Dumbbell,
    path: ROUTES.training.routines,
    pathText: "Ir a rutinas",
    stat: {label: "5 rutinas pendientes", variant: "muted"},
  },
  {
    title: "Rutinas pendientes",
    value: 5,
    icon: Dumbbell,
    path: ROUTES.training.routines,
    pathText: "Ir a rutinas",
    stat: {label: "5 rutinas pendientes", variant: "brand"},
  },
];

export default function Home() {
  return (
    <div>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
        {cards.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
