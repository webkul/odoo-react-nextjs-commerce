"use client";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { createUser } from "../lib/action";
import { LoadingButton } from "./loading-button";
import InputText from "components/form-ui/input";
import PassowrdInputText from "components/form-ui/password-input";
import { formErrorResolver } from "~lib/utils";
import { useActionState } from "react";
const initialState = {
  errors: {
    firstName: [],
    lastName: [],
    email: [],
    password: [],
    passwordConfirmation: [],
  },
};
export default function RegistrationForm() {
  const [status, formAction] = useActionState<any, FormData>(
    createUser,
    initialState,
  );
  return (
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
      <div className="px-4 py-8 bg-white shadow-sm sm:rounded-lg sm:px-10 dark:bg-black">
        <div className="pb-6 sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="py-1 text-2xl font-bold text-center">Become User</h2>
          <p className="mt-2 text-sm text-center">
            If you are new to our store, we glad to have you as member.
          </p>
        </div>
        {status?.errors?.apiError && (
          <div className="flex items-center gap-1 justify-center text-sm text-center mb-4 text-red-500 text-md">
            <ExclamationCircleIcon className="w-5 h-5" />{" "}
            {status?.errors?.apiError && status?.errors?.apiError}
          </div>
        )}
        <form className="flex flex-col gap-y-4" action={formAction}>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3">
              <div className="mt-1">
                <InputText
                  name="firstName"
                  label="First Name"
                  errorMsg={formErrorResolver(status?.errors?.firstname)}
                />
              </div>
            </div>
            <div className="col-span-3">
              <div className="mt-1">
                <InputText name="lastName" label="Last Name" />
              </div>
            </div>
            <div className="col-span-6">
              <div className="mt-1">
                <InputText
                  name="email"
                  label="Email"
                  errorMsg={formErrorResolver(status?.errors?.email)}
                />
              </div>
            </div>
            <div className="col-span-6">
              <div className="mt-1">
                <PassowrdInputText
                  name="password"
                  typeName="password"
                  label="Password"
                  errorMsg={formErrorResolver(status?.errors?.password)}
                />
              </div>
            </div>
            <div className="col-span-6">
              <div className="mt-1">
                <PassowrdInputText
                  name="passwordConfirmation"
                  typeName="password"
                  label="Confirm Password"
                  errorMsg={formErrorResolver(
                    status?.errors?.passwordConfirmation ||
                      status?.errors?.confirm,
                  )}
                />
              </div>
            </div>
          </div>
          <div>
            <LoadingButton buttonName="Sign Up" />
          </div>
        </form>
        <div className="mt-6">
          <div className="text-sm">
            <span className="px-2">
              Already have an account ?{" "}
              <Link href="/customer/login" className="text-blue-600">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
