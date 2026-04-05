import DashboardLayout from "@/components/layouts/dashboard-layout";
import {ReactElement} from "react";

export default function Home() {
  return <div>home</div>;
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
