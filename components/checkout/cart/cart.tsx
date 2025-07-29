import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { isArray, isObject } from "lib/type-guards";
import { createUrl } from "lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";
import { getCart } from "lib/odoo";
import { CartItem } from "lib/odoo/types";
import LogoSquare from "components/logo-square";
import CartItemAccordian from "./cart-item-accordian";
import Thumbnail from "~components/product/Thumbnail";
type MerchandiseSearchParams = {
  [key: string]: string;
};
const { SITE_NAME } = process.env;
export default async function Cart() {
  const cartId = (await cookies()).get("cartId")?.value;

  let cart;
  if (cartId) {
    cart = await getCart();
  }
  return (
    <>
      <div className="flex flex-col w-full gap-6 lg:hidden">
        <div className="flex items-center px-2 mx-auto mt-8 lg:hidden">
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <CartItemAccordian cartItem={cart} />
      </div>
      <div className="mt-2 hidden max-h-[100dvh] w-full flex-col overflow-hidden bg-transparent px-6 text-sm text-black backdrop-blur-xl lg:flex dark:text-white">
        <ul className="min-h-[74dvh] grow overflow-auto py-4">
          {cart?.lines?.map((item: CartItem, i: number) => {
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
              <li key={i} className="flex flex-col w-full">
                <div className="relative flex flex-row justify-between w-full py-4">
                  <div className="bg-primary absolute z-40 -mt-2 ml-[52px] flex h-5 w-5 items-center justify-center rounded-full dark:bg-white/80">
                    <span className="text-sm font-semibold text-white/60 dark:text-black">{item.quantity}</span>
                  </div>
                  <Link href={merchandiseUrl} className="z-30 flex flex-row items-center gap-x-4">
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
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="min-h-[25dvh] overflow-y-scroll py-4 text-sm text-neutral-500 xl:overflow-hidden dark:text-neutral-400">
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
          <div className="flex items-center justify-between pb-1 mb-3">
            <p>Subtotal</p>
            <Price
              className="text-base text-right text-black dark:text-white"
              amount={cart?.prices?.subtotal_excluding_tax?.value || 0}
              currencyCode={cart?.prices?.subtotal_excluding_tax?.currency || "USD"}
            />
          </div>
          <div className="flex items-center justify-between pt-1 pb-1 mb-3">
            <p>Shipping</p>
            {isObject(cart?.shipping_address?.selected_shipping_method) ? (
              <Price
                className="text-base text-right text-black dark:text-white"
                amount={cart?.shipping_address?.selected_shipping_method?.amount?.value || 0}
                currencyCode={cart?.shipping_address?.selected_shipping_method?.amount?.currency || "USD"}
              />
            ) : (
              <p className="text-right">Calculated at next step</p>
            )}
          </div>
          <div className="flex items-center justify-between pt-1 pb-1 mb-3">
            <p className="text-xl font-bold dark:text-white">Total</p>
            <Price
              className="text-base text-right text-black dark:text-white"
              amount={cart?.prices.grand_total.value || 0}
              currencyCode={cart?.prices.grand_total.currency || "USD"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
