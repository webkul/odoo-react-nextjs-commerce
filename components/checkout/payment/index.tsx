"use client";

import { ProceedToCheckout } from "components/checkout/cart/proceed-to-checkout";
import RightArrowIcon from "components/icons/right-arrow";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Radio, RadioGroup } from "@headlessui/react";
import { useActionState, useState } from "react";
import { createPaymentMethod } from "components/checkout/action";
import { OdooCart } from "lib/odoo/types";
import Price from "components/price";
import WalletLogo from "components/icons/wallet-logo";
import { isArray } from "lib/type-guards";

export default function PaymentPage({ cart }: { cart: OdooCart | undefined }) {
  /* eslint-disable */
  const [state, formAction] = useActionState(createPaymentMethod, null);
  const payments = cart?.available_payment_methods;
  const [selected, setSelected] = useState(payments?.[0]);
  const shippingAddress = cart?.shipping_address;

  return (
    <div className="flex-col my-5">
      <div className="relative my-4 rounded-lg border-[1px] border-solid px-3 dark:border-white/30">
        <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
          <tbody>
            <tr className="border-b dark:border-gray-700">
              <td className="py-4">Contact</td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 break-all dark:text-white"
              >
                {shippingAddress?.telephone}
              </th>
              <td className="py-4">
                <Link
                  href="/checkout/information"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Change
                </Link>
              </td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="py-4">Ship to</td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 break-all dark:text-white"
              >
                {`${shippingAddress?.firstname} ${shippingAddress?.lastname} ${shippingAddress?.company} ${shippingAddress?.street[0]} ${shippingAddress?.street?.[1]} ${shippingAddress?.city} ${shippingAddress?.region?.label} ${shippingAddress?.country?.label} ${shippingAddress?.postcode}`}
              </th>
              <td className="py-4 text-center">
                <Link
                  href="/checkout/information"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Change
                </Link>
              </td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="py-4">Method</td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 break-all dark:text-white"
              >
                {`${shippingAddress?.selected_shipping_method?.carrier_title} -`}
                <Price
                  className="inline px-1"
                  amount={
                    shippingAddress?.selected_shipping_method?.amount?.value ||
                    0
                  }
                  currencyCode={
                    shippingAddress?.selected_shipping_method?.amount
                      ?.currency || "USD"
                  }
                  currencyCodeClassName="hidden @[275px]/label:inline"
                />
              </th>
              <td className="py-4 text-center">
                <Link
                  href="/checkout/shipping"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Change
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {isArray(payments) && (
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Payment method</h1>
          <form action={formAction}>
            <div className="w-full">
              <div className="w-full mx-auto">
                <RadioGroup
                  value={selected}
                  onChange={setSelected}
                  aria-label="Server size"
                  className="flex flex-col gap-y-2"
                  name="payementMethod"
                >
                  {isArray(payments) &&
                    payments?.map((pay) => (
                      <Radio
                        key={pay.title}
                        value={pay}
                        className="group relative flex cursor-pointer rounded-lg bg-slate-100 px-5 py-7 text-white shadow-md transition focus:outline-hidden data-[checked]:bg-slate-200 data-[focus]:outline-1 data-[focus]:outline-white dark:bg-white/5 data-[checked]:dark:bg-white/10"
                      >
                        <div className="flex items-center w-full gap-4">
                          <CheckCircleIcon className="size-6 fill-gray-700 opacity-0 transition group-data-[checked]:opacity-100 dark:fill-white" />
                          <div className="text-sm/6">
                            <p className="font-semibold text-gray-700 dark:text-white">
                              {pay.title}
                            </p>
                          </div>
                        </div>
                      </Radio>
                    ))}
                </RadioGroup>
              </div>
            </div>
            <div className="flex flex-col-reverse items-center justify-between gap-4 my-4 sm:flex-row sm:gap-0">
              <button className="flex items-center text-blue-600">
                <RightArrowIcon />
                <Link href="/checkout/shipping" className="mx-1 text-sm">
                  Return to Shipping
                </Link>
              </button>
              <div className="w-full sm:w-2/5">
                <ProceedToCheckout buttonName="Pay Now" />
              </div>
            </div>
          </form>
        </div>
      )}
      {!isArray(payments) && (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Payment</h1>
          <p className="text-neutral-500">
            All transactions are secure and encrypted.
          </p>
          <div className="flex flex-col items-center justify-center h-32 gap-2 px-3 rounded-sm bg-neutral-100">
            <WalletLogo className="text-neutral-400" />
            <p className="text-center text-neutral-500">
              This store can’t accept payments right now.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
