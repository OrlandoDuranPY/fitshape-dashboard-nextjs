"use client";

import {NavItem} from "@/interfaces/nav-item-interface";
import {ChevronDown} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";

/* ========================================
   = Props =
========================================= */
interface Props {
  navItems: NavItem[];
}

export default function DesktopSidebar({navItems}: Props) {
  const pathname = usePathname();

  return (
    <aside className='h-full w-68 hidden lg:flex flex-col bg-card-surface border-r border-border/20'>
      {/* Logo */}
      <div className='p-4 h-18 w-full flex items-center gap-3'>
        <div className='relative h-full aspect-square shrink-0'>
          <Image
            src='/assets/img/logo.png'
            alt='Fitshape Logo'
            width={100}
            height={100}
            className='object-contain'
            loading='eager'
          />
        </div>
        <span className='font-heading text-foreground text-2xl font-bold'>
          FitShape
        </span>
      </div>
      {/* Navegacion */}
      <nav className='p-4 w-full flex-1 gap-2 flex flex-col overflow-y-auto'>
        {navItems.map((item, index) =>
          item.type === "link" ? (
            <Link
              key={index}
              href={item.path}
              className={`px-3 py-2 w-full rounded-lg flex items-center gap-3 font-heading font-medium text-sm transition-colors ${
                pathname === item.path
                  ? "bg-brand/10 text-brand border-l-2 border-brand pl-2.5"
                  : "text-muted-foreground hover:bg-brand/10 hover:text-brand hover:border-brand border-l-2 border-transparent pl-2.5"
              }`}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
            </Link>
          ) : (
            <DropdownItem key={index} item={item} />
          ),
        )}
      </nav>
    </aside>
  );
}

const DropdownItem = ({item}: {item: Extract<NavItem, {type: "dropdown"}>}) => {
  const pathname = usePathname();
  const isAnyChildActive = item.children.some(
    (child) => pathname === child.path,
  );
  const [open, setOpen] = useState(isAnyChildActive);

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`px-3 py-2 w-full rounded-lg flex items-center gap-3 font-heading font-medium text-sm transition-colors cursor-pointer border-l-2 pl-2.5 ${
          isAnyChildActive
            ? "bg-brand/10 text-brand border-brand"
            : "text-muted-foreground hover:bg-brand/10 hover:text-brand hover:border-brand border-transparent"
        }`}
      >
        <item.icon size={17} />
        <span className='flex-1 text-left'>{item.label}</span>
        <ChevronDown
          size={15}
          className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className='ml-5 mt-1 flex flex-col gap-0.5 border-l border-brand/20 pl-3'>
          {item.children.map((child, index) => (
            <Link
              key={index}
              href={child.path}
              className={`px-3 py-1.5 rounded-md font-heading text-sm font-medium transition-colors ${
                pathname === child.path
                  ? "text-brand"
                  : "text-muted-foreground hover:bg-brand/10 hover:text-brand"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
