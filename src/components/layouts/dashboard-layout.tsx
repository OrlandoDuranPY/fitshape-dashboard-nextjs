import {Beef, Dumbbell, LayoutDashboard} from "lucide-react";
import DesktopSidebar from "./dashboard/desktop-sidebar";
import TopBar from "./dashboard/top-bar";
import {ROUTES} from "@/routing/routes";
import {NavItem} from "@/interfaces/nav-item-interface";
import MobileSidebar from "./dashboard/mobile-sidebar";
import {useState} from "react";
import Footer from "./dashboard/footer";

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
      {
        label: "Planes de entrenamiento",
        path: ROUTES.training.plans,
        subRoutes: [{label: "Crear plan", path: ROUTES.training.plansCreate}],
      },
      {label: "Rutinas", path: ROUTES.training.routines},
      {label: "Clientes", path: ROUTES.training.coachees},
      {label: "Ejercicios", path: ROUTES.training.exercises},
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section className='w-full h-dvh bg-background flex flex-col lg:flex-row'>
      {/* Menu */}
      <DesktopSidebar navItems={navItems} />
      <MobileSidebar
        navItems={navItems}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <main className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <TopBar onMenuClick={() => setMobileOpen(true)} navItems={navItems} />

        {/* Contenido principal */}
        <div className='flex-1 overflow-y-auto p-4'>{children}</div>
        <Footer />
      </main>
    </section>
  );
}
