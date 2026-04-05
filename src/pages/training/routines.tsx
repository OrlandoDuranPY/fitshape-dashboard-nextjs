import DashboardLayout from "@/components/layouts/dashboard-layout";
import {ReactElement} from "react";

export default function Routines() {
  return <div>Routines</div>;
}

Routines.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
