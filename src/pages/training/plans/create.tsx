import DashboardLayout from "@/components/layouts/dashboard-layout";
import {Card} from "@/components/ui/card";
import {ReactElement} from "react";

export default function CreatePlan() {
  return (
    <section>
      <Card>
        <div className='px-4 w-full'></div>
      </Card>
    </section>
  );
}

CreatePlan.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
