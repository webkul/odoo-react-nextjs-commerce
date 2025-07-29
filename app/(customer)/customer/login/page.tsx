import { LoginForm } from "components/customer/login/login-form";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function LoginPage() {
  return <LoginForm />;
}
