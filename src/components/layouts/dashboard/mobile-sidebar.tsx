import {NavItem} from "@/interfaces/nav-item-interface";
import {ChevronDown, X} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import ThemeToggle from "./theme-toggle";

/* ========================================
   = Props =
========================================= */
interface Props {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({navItems, isOpen, onClose}: Props) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`absolute top-0 left-0 h-full w-3/4 bg-card-surface flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className='p-4 h-18 flex items-center justify-between'>
          {/* Logo */}
          <div className='h-full w-full flex items-center gap-3'>
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
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-brand transition-colors cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className='px-4 flex flex-col gap-2 overflow-y-auto flex-1'>
          {navItems.map((item, index) =>
            item.type === "link" ? (
              <Link
                key={index}
                href={item.path}
                onClick={onClose}
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
              <MobileDropdownItem key={index} item={item} onClose={onClose} />
            ),
          )}
        </nav>

        {/* Theme toggle */}
        <div className='px-4 py-4 border-t border-border flex items-center gap-2'>
          <span className='text-muted-foreground font-heading text-sm flex-1'>
            Tema
          </span>
          <ThemeToggle />
        </div>
      </aside>
    </div>
  );
}

const MobileDropdownItem = ({
  item,
  onClose,
}: {
  item: Extract<NavItem, {type: "dropdown"}>;
  onClose: () => void;
}) => {
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
              onClick={onClose}
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
