"use client";

import Link from "next/link";
import { z } from "zod";
import { LoadingButton } from "./loading-button";
import InputText from "components/form-ui/input";
import { signIn } from "next-auth/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import PassowrdInputText from "components/form-ui/password-input";
import { useRouter } from "next/navigation";
import { formErrorResolver, removeFromLocalStorage } from "~lib/utils";
import { SAVED_LOCAL_STORAGE } from "~lib/constants";
import { useActionState } from "react";

const loginDefaultValue = {
  errors: {
    username: [],
    password: [],
  },
};
const loginSchema = z.object({
  username: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(6, { message: "Be at least 6 characters long" }).trim(),
});
export function LoginForm() {
  const router = useRouter();

  async function authenticate(prevState: any, formData: FormData) {
    try {
      const data = {
        username: formData.get("email"),
        password: formData.get("password"),
      };
      const validatedFields = loginSchema.safeParse(data);

      if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
        };
      }
     
      return await signIn("credentials", {
        redirect: false,
        ...data,
        callbackUrl: "/",
      })
        .then((result) => {
          
          if (result?.ok) {
            router.push("/");
          }
          removeFromLocalStorage(SAVED_LOCAL_STORAGE);
          return {
            errors: {
              apiError: result?.error,
            },
          };
        })
        .catch((errr) => {
          console.log(errr);
        });
    } catch (error) {
      console.error("Something went wrong :", error);
    }
  }
  const [status, dispatch] = useActionState<any, FormData>(authenticate, loginDefaultValue);

  return (
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="px-4 py-8 bg-white shadow-sm sm:rounded-lg sm:px-10 dark:bg-black">
        <div className="pb-6 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="py-1 text-2xl font-bold text-center">Sign in to your account</h2>
          <p className="mt-2 text-sm text-center">If you have an account, sign in with your email address.</p>
        </div>
        {status?.errors?.apiError && (
          <div className="flex items-start justify-center text-sm text-center gap-1 mb-4 text-red-500 text-md">
            <ExclamationCircleIcon className="w-5 h-5" /> {status?.errors?.apiError}
          </div>
        )}
        <form className="flex flex-col gap-y-4" action={dispatch}>
          <div>
            <InputText
              name="email"
              label="Enter Email"
              typeName="email"
              errorMsg={formErrorResolver(status?.errors?.username)}
            />
          </div>
          <div>
            <PassowrdInputText
              name="password"
              label="Enter Password"
              typeName="password"
              errorMsg={formErrorResolver(status?.errors?.password)}
            />
          </div>
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link href="/customer/forget-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <LoadingButton buttonName="Sign In" />
          </div>
        </form>
        <div className="mt-6">
          <div className="text-sm">
            <span className="px-2">
              New customer?{" "}
              <Link href="/customer/register" className="font-medium text-blue-600 hover:text-blue-500">
                Create your account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
