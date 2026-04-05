import DashboardLayout from "@/components/layouts/dashboard-layout";
import {ReactElement} from "react";

export default function Coachees() {
  return <div>Coachees</div>;
}

Coachees.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
