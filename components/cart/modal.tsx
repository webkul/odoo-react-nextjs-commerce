"use client";

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import type { Cart, CartItem, Window } from "lib/odoo/types";
import { createUrl } from "lib/utils";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import CloseCart from "./close-cart";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";
import { isArray, isObject } from "lib/type-guards";
import Thumbnail from "~components/product/Thumbnail";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({ cart }: { cart: Cart | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.total_quantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    // Open cart modal when quantity changes.
    if (cart?.total_quantity !== quantityRef.current) {
      // But only if it's not already open (quantity also changes when editing items in cart).
      if (!isOpen && !(window as Window).isLogOutLoading) {
        setIsOpen(true);
      }
      // Always update the quantity reference
      quantityRef.current = cart?.total_quantity;
    }
  }, [isOpen, cart?.total_quantity, quantityRef]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.total_quantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>

                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!isObject(cart) || cart.lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full mt-20 overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-2xl font-bold text-center">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex flex-col justify-between h-full p-1 overflow-hidden">
                  <ul className="py-4 overflow-auto grow">
                    {cart.lines.map((item: CartItem, i: number) => {
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
                        <li
                          key={i}
                          className="flex flex-col w-full border-b border-neutral-300 dark:border-neutral-700"
                        >
                          <div className="relative flex flex-row justify-between w-full px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton item={item} />
                            </div>
                            <Link href={merchandiseUrl} onClick={closeCart} className="z-30 flex flex-row gap-x-4">
                              <div className="relative w-16 h-16 overflow-hidden border rounded-md cursor-pointer border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Thumbnail
                                  className="object-cover w-full h-full"
                                  width={64}
                                  height={64}
                                  alt={item.product.thumbnail.label || item.product.name}
                                  src={item.product.thumbnail.url}
                                />
                              </div>

                              <div className="flex flex-col flex-1 text-base">
                                <span className="leading-tight">{item.product.name}</span>
                                {item.product.name !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.product.sku}</p>
                                ) : null}
                              </div>
                            </Link>
                            <div className="flex flex-col justify-between h-16">
                              <Price
                                className="flex justify-end text-sm text-right gap-y-2"
                                amount={item?.product.prices.price.value}
                                currencyCode={item?.product.prices.price.currency}
                              />
                              <div className="flex flex-row items-center ml-auto border rounded-full h-9 border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton item={item} type="minus" />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">{item.quantity}</span>
                                </p>
                                <EditItemQuantityButton item={item} type="plus" />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {isArray(cart?.prices.applied_taxes) &&
                      cart?.prices.applied_taxes.map((txtPrice, taxIndex) => (
                        <div
                          key={taxIndex}
                          className="flex items-center justify-between pb-1 mb-3 border-b border-neutral-200 dark:border-neutral-700"
                        >
                          <p>{isObject(txtPrice) && txtPrice.name[0]?.toUpperCase() + txtPrice.name.slice(1)}</p>
                          <Price
                            className="text-base text-right text-black dark:text-white"
                            amount={txtPrice.value}
                            currencyCode={txtPrice.currency}
                          />
                        </div>
                      ))}

                    <div className="flex items-center justify-between pt-1 pb-1 mb-3 border-b border-neutral-200 dark:border-neutral-700">
                      <p>Shipping</p>
                      <p className="text-right">Calculated at checkout</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 pb-1 mb-3 border-b border-neutral-200 dark:border-neutral-700">
                      <p>Total</p>
                      <Price
                        className="text-base text-right text-black dark:text-white"
                        amount={cart.prices.grand_total.value}
                        currencyCode={cart.prices.grand_total.currency}
                      />
                    </div>
                  </div>
                  <Link
                    href="/checkout/information"
                    className="block w-full p-3 text-sm font-medium text-center text-white bg-blue-600 rounded-full opacity-90 hover:opacity-100"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </DialogPanel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
