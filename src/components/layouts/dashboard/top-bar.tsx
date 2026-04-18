import {NavItem} from "@/interfaces/nav-item-interface";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Menu} from "lucide-react";
import {usePathname} from "next/navigation";
import React from "react";
import ThemeToggle from "./theme-toggle";

interface Props {
  onMenuClick: () => void;
  navItems: NavItem[];
}

function getBreadcrumbs(pathname: string, navItems: NavItem[]) {
  for (const item of navItems) {
    if (item.type === "link" && item.path === pathname) {
      return [{label: item.label}];
    }
    if (item.type === "dropdown") {
      const child = item.children.find((c) => c.path === pathname);
      if (child) {
        return [{label: item.label}, {label: child.label}];
      }
      for (const child of item.children) {
        const sub = child.subRoutes?.find((s) => s.path === pathname);
        if (sub) {
          return [{label: item.label}, {label: child.label}, {label: sub.label}];
        }
      }
    }
  }
  return [];
}

export default function TopBar({onMenuClick, navItems}: Props) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname, navItems);

  return (
    <div className='w-full px-4 pt-4 flex justify-between items-center gap-4'>
      {/* Mobile: hamburger + título de página actual */}
      <div className='flex items-center gap-3 lg:hidden'>
        <Menu
          size={18}
          className='hover:cursor-pointer shrink-0'
          onClick={onMenuClick}
        />
        {crumbs.length > 0 && (
          <span className='font-heading font-semibold text-sm text-foreground'>
            {crumbs[crumbs.length - 1].label}
          </span>
        )}
      </div>

      {/* Breadcrumb desktop */}
      {crumbs.length > 0 && (
        <Breadcrumb className='hidden lg:block'>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === crumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <span className='text-muted-foreground font-medium'>
                      {crumb.label}
                    </span>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className='hidden lg:flex gap-3 items-center'>
        {/* Modo claro/oscuro  */}
        <ThemeToggle />

        {/* Dropdown de usuario */}
        {/* <UserDropdownComponent /> */}
      </div>
    </div>
  );
}
