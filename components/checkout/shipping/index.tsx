"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createShippingMethod } from "../action";
import { ProceedToCheckout } from "../cart/proceed-to-checkout";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import RightArrowIcon from "components/icons/right-arrow";
import { OdooCart } from "lib/odoo/types";
export default function ShippingMethod({
  cartData,
}: {
  cartData: OdooCart | undefined;
}) {
  const availableShippingMethods =
    cartData?.shipping_address?.available_shipping_methods || [];
  /* eslint-disable */
  const [state, formAction] = useActionState(createShippingMethod, null);

  const [selected, setSelected] = useState(availableShippingMethods[0]);
  const shippingAddress = cartData?.shipping_address;
  return (
    <div className="flex flex-col gap-6 my-6">
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
                className="px-6 py-4 font-medium text-gray-900 dark:text-white"
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
          </tbody>
        </table>
      </div>

      <div className="w-full">
        <form action={formAction}>
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold">Shipping method</h1>
            <div className="w-full mx-auto">
              <RadioGroup
                value={selected}
                onChange={setSelected}
                aria-label="Server size"
                name="shippingMethods"
                className="flex flex-col gap-y-2"
              >
                {availableShippingMethods.map((method) => (
                  <Radio
                    key={method.carrier_code}
                    value={method}
                    className="group relative flex cursor-pointer rounded-lg bg-slate-100 px-5 py-4 text-white shadow-md transition focus:outline-hidden data-[checked]:bg-slate-200 data-[focus]:outline-1 data-[focus]:outline-white dark:bg-white/5 data-[checked]:dark:bg-white/10"
                  >
                    <div className="flex items-center w-full gap-4">
                      <CheckCircleIcon className="size-6 fill-gray-700 opacity-0 transition group-data-[checked]:opacity-100 dark:fill-white" />
                      <div className="text-sm/6">
                        <p className="font-semibold text-gray-700 dark:text-white">
                          {method.carrier_title}
                        </p>
                        <div className="flex gap-0.5 text-gray-700 dark:text-white/50">
                          <div>{method?.amount?.value || 0}</div>
                          <div>{method?.amount?.currency}</div>
                        </div>
                      </div>
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
            </div>
            <div className="flex flex-col-reverse items-center justify-between gap-4 my-4 sm:flex-row sm:gap-0">
              <button className="flex items-center text-blue-600">
                <RightArrowIcon />
                <Link href="/checkout/information" className="mx-1 text-sm">
                  Return to Information
                </Link>
              </button>
              <div className="w-full sm:w-2/5">
                <ProceedToCheckout buttonName="Continue to Payment" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
