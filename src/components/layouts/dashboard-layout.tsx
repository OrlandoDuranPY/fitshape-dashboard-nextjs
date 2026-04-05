import {Beef, Dumbbell, LayoutDashboard} from "lucide-react";
import DesktopSidebar from "./dashboard/desktop-sidebar";
import TopBar from "./dashboard/top-bar";
import {ROUTES} from "@/routing/routes";
import {NavItem} from "@/interfaces/nav-item-interface";

const navItems: NavItem[] = [
  {
    type: "link",
    label: "Inicio",
    icon: LayoutDashboard,
    path: ROUTES.home,
  },
  {
    type: "dropdown",
    label: "Entrenamiento",
    icon: Dumbbell,
    children: [
      {label: "Rutinas", path: ROUTES.training.routines},
      {label: "Clientes", path: ROUTES.training.coachees},
    ],
  },
  {
    type: "dropdown",
    label: "Nutrición",
    icon: Beef,
    children: [{label: "Comida", path: ROUTES.nutrition.foods}],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='w-full h-dvh bg-background flex flex-col lg:flex-row'>
      {/* Menu */}
      <DesktopSidebar navItems={navItems} />

      {/* Main content */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <TopBar />

        {/* Contenido principal */}
        <div className='flex-1 overflow-y-auto p-4'>{children}</div>
      </main>
    </section>
  );
}
