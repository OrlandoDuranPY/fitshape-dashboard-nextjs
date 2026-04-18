import DashboardLayout from "@/components/layouts/dashboard-layout";
import {ReactElement} from "react";

export default function CreatePlan() {
  return <div>Create</div>;
}

CreatePlan.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
