'use client';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import ShoppingCartIcon from '../../icons/shopping-cart';
import { CartItem, OdooCart } from 'lib/odoo/types';
import { isArray, isObject } from 'lib/type-guards';

type MerchandiseSearchParams = {
  [key: string]: string;
};
export default function CartItemAccordian({ cartItem }: { cartItem: OdooCart | undefined }) {
  return (
    <div className="mx-auto w-full bg-white/80 dark:bg-transparent">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between border-0 border-y-[1px] bg-gray-100 px-6 py-5 text-left text-sm font-medium text-blue-900 duration-500 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75 sm:px-3 md:px-2 lg:px-0 dark:border-gray-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
              <div className="mx-auto flex w-full max-w-2xl items-center justify-between lg:max-w-6xl">
                <div className="text-md text-primary hover:text-primary-600 flex items-center justify-center gap-1 sm:gap-2">
                  <div className="flex gap-2">
                    <ShoppingCartIcon />
                    {open ? (
                      <p className="text-base">Hide order summary</p>
                    ) : (
                      <p className="text-base">Show order summary</p>
                    )}
                  </div>

                  <ChevronUpIcon
                    className={`${
                      open
                        ? 'text-primary rotate-180 transform font-bold duration-300'
                        : 'rotate-90 transform font-bold duration-300'
                    } text-primary h-4 w-4`}
                  />
                </div>
                <Price
                  className="text-right text-base font-extrabold text-black dark:text-white"
                  amount={cartItem?.prices?.grand_total?.value || 0}
                  currencyCode={cartItem?.prices?.grand_total?.currency || 'USD'}
                />
              </div>
            </Disclosure.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform opacity-0 -translate-y-5"
              enterTo="transform opacity-100 translate-y-0"
              leave="transition duration-75 ease-out"
              leaveFrom="transform opacity-100 translate-y-0"
              leaveTo="transform opacity-0 -translate-y-5"
            >
              <Disclosure.Panel className="mx-auto w-full max-w-2xl px-4 pb-2 pt-4 text-sm text-gray-500 sm:px-2 md:px-0 lg:max-w-6xl">
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="m flex-grow overflow-auto py-4">
                    {cartItem?.items?.map((item: CartItem, i: number) => {
                      const merchandiseSearchParams = {} as MerchandiseSearchParams;

                      item.configurable_options.forEach(({ option_label, value_label }) => {
                        if (value_label !== DEFAULT_OPTION) {
                          merchandiseSearchParams[option_label.toLowerCase()] = value_label;
                        }
                      });

                      const merchandiseUrl = createUrl(
                        `/product/${item.product.url_key}`,
                        new URLSearchParams(merchandiseSearchParams)
                      );
                      return (
                        <li key={i} className="flex w-full flex-col">
                          <div className="relative flex w-full flex-row justify-between py-4">
                            <div className="bg-primary absolute z-40 -mt-2 ml-[52px] flex h-5 w-5 items-center justify-center rounded-full dark:bg-white/80">
                              <span className="text-sm font-semibold text-white/60 dark:text-black">
                                {item.quantity}
                              </span>
                            </div>
                            <Link
                              href={merchandiseUrl}
                              className="z-30 flex flex-row items-center space-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={item.product.thumbnail.label || item.product.name}
                                  src={item.product.thumbnail.url || '/image/placeholder.webp'}
                                />
                              </div>
                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">{item.product.name}</span>
                                {item.product.name !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {item.product.sku}
                                  </p>
                                ) : null}
                              </div>
                            </Link>
                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-right text-sm"
                                amount={item?.product.prices.price.value}
                                currencyCode={item?.product.prices.price.currency}
                              />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {isArray(cartItem?.prices.applied_taxes) &&
                      cartItem?.prices.applied_taxes.map((txtPrice, taxIndex) => (
                        <div
                          key={taxIndex}
                          className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700"
                        >
                          <p>
                            {isObject(txtPrice) &&
                              txtPrice.name[0]?.toUpperCase() + txtPrice.name.slice(1)}
                          </p>
                          <Price
                            className="text-right text-base text-black dark:text-white"
                            amount={txtPrice.value}
                            currencyCode={txtPrice.currency}
                          />
                        </div>
                      ))}
                    <div className="mb-3 flex items-center justify-between pb-1">
                      <p>Subtotal</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={cartItem?.prices?.subtotal_excluding_tax?.value || 0}
                        currencyCode={cartItem?.prices?.subtotal_excluding_tax?.currency || 'USD'}
                      />
                    </div>
                    <div className="mb-3 flex items-center justify-between pb-1 pt-1">
                      <p>Shipping</p>
                      {isObject(cartItem?.shipping_address?.selected_shipping_method) ? (
                        <Price
                          className="text-right text-base text-black dark:text-white"
                          amount={
                            cartItem?.shipping_address?.selected_shipping_method?.amount?.value || 0
                          }
                          currencyCode={
                            cartItem?.shipping_address?.selected_shipping_method?.amount
                              ?.currency || 'USD'
                          }
                        />
                      ) : (
                        <p className="text-right">Calculated at next step</p>
                      )}
                    </div>
                    <div className="mb-3 flex items-center justify-between pb-1 pt-1">
                      <p className="text-xl font-bold dark:text-white">Total</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={cartItem?.prices.grand_total.value || 0}
                        currencyCode={cartItem?.prices.grand_total.currency || 'USD'}
                      />
                    </div>
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
}
