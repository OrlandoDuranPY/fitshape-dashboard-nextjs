import DashboardLayout from "@/components/layouts/dashboard-layout";
import MetricCard from "@/components/ui/metric-card";
import {ROUTES} from "@/routing/routes";
import {Dumbbell} from "lucide-react";
import {ReactElement} from "react";

const cards = [
  {
    title: "Rutinas pendientes",
    value: 5,
    icon: Dumbbell,
    path: ROUTES.training.routines,
    pathText: "Ir a rutinas",
    stat: {label: "5 rutinas pendientes"},
  },
  {
    title: "Rutinas pendientes",
    value: 5,
    icon: Dumbbell,
    path: ROUTES.training.routines,
    pathText: "Ir a rutinas",
    stat: {label: "5 rutinas pendientes"},
  },
  {
    title: "Rutinas pendientes",
    value: 5,
    icon: Dumbbell,
    path: ROUTES.training.routines,
    pathText: "Ir a rutinas",
    stat: {label: "5 rutinas pendientes"},
  },
  {
    title: "Rutinas pendientes",
    value: 5,
    icon: Dumbbell,
    path: ROUTES.training.routines,
    pathText: "Ir a rutinas",
    stat: {label: "5 rutinas pendientes"},
  },
  {
    title: "Rutinas pendientes",
    value: 5,
    icon: Dumbbell,
    path: ROUTES.training.routines,
    pathText: "Ir a rutinas",
    stat: {label: "5 rutinas pendientes"},
  },
];

export default function Home() {
  return (
    <div>
      <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-4'>
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
