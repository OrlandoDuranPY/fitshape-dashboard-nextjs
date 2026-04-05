import DashboardLayout from "@/components/layouts/dashboard-layout";
import {ReactElement} from "react";

export default function Foods() {
  return <div>Foods</div>;
}

Foods.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
