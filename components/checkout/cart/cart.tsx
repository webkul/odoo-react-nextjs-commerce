import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { isArray, isObject } from 'lib/type-guards';
import { createUrl } from 'lib/utils';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { getCart } from 'lib/odoo';
import { CartItem } from 'lib/odoo/types';
import LogoSquare from 'components/logo-square';
import CartItemAccordian from './cart-item-accordian';
type MerchandiseSearchParams = {
  [key: string]: string;
};
const { SITE_NAME } = process.env;
export default async function Cart() {
  const cartId = cookies().get('cartId')?.value;

  let cart;
  if (cartId) {
    cart = await getCart(cartId);
  }
  return (
    <>
      <div className="flex w-full flex-col gap-6 lg:hidden">
        <div className="mx-auto mt-8 flex items-center px-2 lg:hidden">
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <CartItemAccordian cartItem={cart} />
      </div>
      <div className="mt-2 hidden max-h-[95dvh] w-full flex-col overflow-hidden bg-transparent px-6 text-sm text-black backdrop-blur-xl lg:flex dark:text-white">
        <ul className="min-h-[74dvh] flex-grow overflow-auto py-4">
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
              <li key={i} className="flex w-full flex-col">
                <div className="relative flex w-full flex-row justify-between py-4">
                  <div className="bg-primary absolute z-40 -mt-2 ml-[52px] flex h-5 w-5 items-center justify-center rounded-full dark:bg-white/80">
                    <span className="text-sm font-semibold text-white/60 dark:text-black">
                      {item.quantity}
                    </span>
                  </div>
                  <Link href={merchandiseUrl} className="z-30 flex flex-row items-center space-x-4">
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
        <div className="min-h-[25dvh] overflow-y-scroll py-4 text-sm text-neutral-500 xl:overflow-hidden dark:text-neutral-400">
          {isArray(cart?.prices.applied_taxes) &&
            cart?.prices.applied_taxes.map((txtPrice, taxIndex) => (
              <div
                key={taxIndex}
                className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700"
              >
                <p>
                  {isObject(txtPrice) && txtPrice.name[0]?.toUpperCase() + txtPrice.name.slice(1)}
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
              amount={cart?.prices?.subtotal_excluding_tax?.value || 0}
              currencyCode={cart?.prices?.subtotal_excluding_tax?.currency || 'USD'}
            />
          </div>
          <div className="mb-3 flex items-center justify-between pb-1 pt-1">
            <p>Shipping</p>
            {isObject(cart?.shipping_address?.selected_shipping_method) ? (
              <Price
                className="text-right text-base text-black dark:text-white"
                amount={cart?.shipping_address?.selected_shipping_method?.amount?.value || 0}
                currencyCode={
                  cart?.shipping_address?.selected_shipping_method?.amount?.currency || 'USD'
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
              amount={cart?.prices.grand_total.value || 0}
              currencyCode={cart?.prices.grand_total.currency || 'USD'}
            />
          </div>
        </div>
      </div>
    </>
  );
}
