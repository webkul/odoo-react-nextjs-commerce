import RegistrationForm from "components/customer/login/registration-form";

export const metadata = {
  title: "Registration Form",
  description: "Customer registration page",
};

export default async function Register() {
  return <RegistrationForm />;
}
