import { GlobalContextProvider } from "app/context/store";
import Cart from "components/checkout/cart/cart";
import Loading from "components/checkout/loading";
import NextBreadcrumb from "components/checkout/next-breadcrumb";
import FormPlaceHolder from "components/checkout/place-holder";
import LogoSquare from "components/logo-square";
import Link from "next/link";
import { Suspense } from "react";
const { SITE_NAME } = process.env;
export default function CheckoutLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="flex min-h-[100dvh] flex-col-reverse justify-between lg:flex-row">
        <div className="flex-initial mx-auto w-full max-w-2xl shrink-0 grow-0 gap-0 overflow-auto border-0 border-neutral-200 px-4 py-10 md:px-0 lg:basis-[55.5%] lg:border-r-[1px] lg:px-6 dark:border-gray-700">
          <div className="min-h-[100dvh] lg:min-h-[85dvh]">
            <header className="flex flex-col gap-4">
              <div className="flex-col hidden w-full gap-6 lg:flex">
                <div>
                  <Link
                    className="flex items-center gap-2 text-black md:pt-1 dark:text-white"
                    href="/"
                  >
                    <LogoSquare />
                    <span className="uppercase">{SITE_NAME}</span>
                  </Link>
                </div>
              </div>
              <NextBreadcrumb />
            </header>
            <Suspense fallback={<FormPlaceHolder />}>
              <GlobalContextProvider>{children}</GlobalContextProvider>
            </Suspense>
          </div>
          <hr className="!border-[1px] border-gray-200 dark:border-gray-600" />
          <p className="my-2 text-sm text-neutral-400 dark:text-white/60">
            All rights reserved Dev Vercel Shop.
          </p>
        </div>
        <div className="max-h-auto w-full flex-initial flex-shrink-0 grow-0 lg:sticky lg:top-0 lg:max-h-[100dvh] lg:basis-[44.5%]">
          <Suspense fallback={<Loading />}>
            <Cart />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
