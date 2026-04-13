import DashboardLayout from "@/components/layouts/dashboard-layout";
import {ReactElement} from "react";

export default function Plans() {
  return <div>Plans</div>;
}

Plans.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
