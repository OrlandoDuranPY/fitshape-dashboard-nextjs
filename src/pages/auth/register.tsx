import AuthLayout from "./layouts/AuthLayout";
import type {ReactElement} from "react";

export default function register() {
  return <div>registerPage</div>;
}

register.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
