"use client";

import Link from "next/link";
import { recoverPassword, RecoverPasswordType } from "../lib/action";
import { LoadingButton } from "./loading-button";
import InputText from "components/form-ui/input";
import { isObject } from "lib/type-guards";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useActionState } from "react";
const initialState = {
  errors: {
    email: [],
    apiRes: {
      msg: "",
      status: false,
    },
  },
};
export function ForgetPasswordForm() {
  const [errorStatus, formAction] = useActionState<
    RecoverPasswordType,
    FormData
  >(recoverPassword, initialState);

  return (
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="px-4 py-8 bg-white shadow-sm sm:rounded-lg sm:px-10 dark:bg-black">
        {isObject(errorStatus?.errors?.apiRes) && (
          <div
            className={`text-sm flex items-start justify-center text-center gap-1 pb-2 ${
              errorStatus?.errors?.apiRes?.status
                ? "text-green-500"
                : " text-red-600"
            } `}
          >
            {errorStatus?.errors?.apiRes?.status && (
              <CheckCircleIcon className="w-6 h-6" />
            )}
            {!errorStatus?.errors?.apiRes?.status &&
              errorStatus?.errors?.apiRes?.msg && (
                <ExclamationCircleIcon className="w-5 h-5" />
              )}
            {errorStatus?.errors?.apiRes?.msg}
          </div>
        )}
        <div className="pb-2 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="py-1 text-2xl font-bold text-center">
            Recover Password
          </h2>
          <p className="mt-2 text-sm text-center">
            If you forgot your password, recover it by entering your email
            address.
          </p>
        </div>
        <form
          className="flex flex-col gap-y-4"
          action={formAction}
        >
          <div className="mt-1">
            <InputText
              name="email"
              typeName="text"
              label="Email Address"
              errorMsg={errorStatus?.errors?.email}
            />
          </div>

          <div>
            <LoadingButton buttonName="Reset password" />
          </div>
        </form>

        <div className="mt-6">
          <div className="text-sm">
            <span className="px-2">
              Back to sign In ?{" "}
              <Link href="/customer/login" className="text-blue-600">
                {" "}
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
