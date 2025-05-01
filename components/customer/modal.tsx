"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

import { isObject } from "lib/type-guards";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { userLogoOut } from "./lib/action";
import OpenAuth from "./open-auth";
import LoadingDots from "components/loading-dots";
import clsx from "clsx";
import Image from "next/image";
import { Window } from "~lib/odoo/types";
export default function CredentialModal() {
  const [isLoading, setLoader] = useState<string>("");
  const { data: session } = useSession();
  const [status, handleLogout] = useActionState(userLogoOut, undefined);
  useEffect(() => {
    if (isObject(status)) {
      signOut({ callbackUrl: "/customer/login", redirect: false });
    }
  }, [status]);
  const loadStatusHandler = (type: string) => {
    (window as Window).isLogOutLoading = true;
    isLoading === "" && setLoader(type);
  };

  return (
    <Popover>
      <PopoverButton className="block text-sm/6 font-semibold text-white/50 focus:outline-hidden data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
        <OpenAuth />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="!top-20 divide-y divide-white/5 rounded-xl bg-white/80 text-sm/6 backdrop-blur-xl transition duration-700 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0 dark:bg-black/90 dark:backdrop-blur-none"
      >
        <div className="px-6 py-4">
          {isObject(session?.user) ? (
            <div className="bg-transparent border-none shadow-none min-w-60 max-w-80">
              <div className="justify-between">
                <div className="flex gap-3">
                  <Image
                    className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                    src="/icons/user.png"
                    width={10}
                    height={10}
                    alt="Bordered avatar"
                    priority
                  ></Image>
                  <div className="flex flex-col items-start justify-center">
                    <h4 className="font-semibold leading-none text-small text-default-500 dark:text-white">
                      {session?.user?.name}
                    </h4>
                    <h5 className="tracking-tight text-small text-default-500 dark:text-white">
                      {session?.user?.email}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="pl-px text-small text-default-500 dark:text-white">
                  Manage Cart, Orders
                  <span aria-label="confetti" className="px-2" role="img">
                    🎉
                  </span>
                </p>
              </div>
              <div>
                <form action={handleLogout}>
                  <button
                    onClick={() => loadStatusHandler("logout")}
                    type="submit"
                    className={clsx(
                      "my-2 w-full rounded-full bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-hidden focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
                      isLoading === "logout" ? "cursor-not-allowed" : "",
                    )}
                  >
                    <div className="mx-1">
                      {isLoading === "logout" ? (
                        <div className="flex items-center justify-center">
                          <p>Loading</p>
                          <LoadingDots className="bg-white" />
                        </div>
                      ) : (
                        <p> Log Out</p>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-transparent border-none shadow-none min-w-80">
              <div className="justify-between">
                <div className="flex gap-3">
                  <h4 className="text-xl font-semibold leading-none text-default-600 dark:text-white">
                    Welcome Guest
                  </h4>
                </div>
              </div>
              <div className="px-3 py-0">
                <p className="pl-px text-small text-default-500 dark:text-white">
                  Manage Cart, Orders
                  <span aria-label="confetti" className="px-2" role="img">
                    🎉
                  </span>
                </p>
              </div>
              <div className="flex gap-4 my-2">
                <Link
                  onClick={() => loadStatusHandler("login")}
                  href="/customer/login"
                  className="w-full"
                >
                  <button
                    type="button"
                    className={clsx(
                      "mb-2 w-full rounded-full bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-hidden focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                      isLoading === "login" ? "cursor-not-allowed" : "",
                    )}
                  >
                    <div className="mx-1">
                      {isLoading === "login" ? (
                        <div className="flex items-center justify-center">
                          <p>Loading</p>
                          <LoadingDots className="bg-white" />
                        </div>
                      ) : (
                        <p> Sign In</p>
                      )}
                    </div>
                  </button>
                </Link>
                <Link href="/customer/register" className="w-full">
                  <button
                    onClick={() => loadStatusHandler("signup")}
                    type="button"
                    className={clsx(
                      "mb-2 w-full rounded-full bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-hidden focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
                      isLoading === "signup" ? "cursor-not-allowed" : "",
                    )}
                  >
                    <div className="mx-1">
                      {isLoading === "signup" ? (
                        <div className="flex items-center justify-center">
                          <p>Loading</p>
                          <LoadingDots className="bg-white" />
                        </div>
                      ) : (
                        <p> Sign Up</p>
                      )}
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
}
