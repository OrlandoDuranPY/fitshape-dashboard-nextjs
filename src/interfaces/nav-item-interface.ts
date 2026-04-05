import type {LucideIcon} from "lucide-react";

export interface NavItemLink {
  type: "link";
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface NavItemDropdown {
  type: "dropdown";
  label: string;
  icon: LucideIcon;
  children: {label: string; path: string}[];
}

export type NavItem = NavItemLink | NavItemDropdown;
