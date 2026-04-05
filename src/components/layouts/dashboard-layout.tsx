import DesktopSidebar from "./dashboard/desktop-sidebar";
import TopBar from "./dashboard/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='w-full h-dvh bg-background flex flex-col lg:flex-row'>
      {/* Menu */}
      <DesktopSidebar />

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
