import {Badge} from "@/components/ui/badge";

/* ========================================
   = Props =
========================================= */
interface StatusBadgeProps {
  status: boolean;
}

/* ========================================
   = Component =
========================================= */
export default function StatusBadge({status}: StatusBadgeProps) {
  return (
    <Badge
      className={
        status
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-brand/10 text-brand dark:bg-brand/20"
      }
    >
      {status ? "Activo" : "Inactivo"}
    </Badge>
  );
}
