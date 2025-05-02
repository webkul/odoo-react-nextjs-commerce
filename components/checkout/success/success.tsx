import { BasketCartIcon } from "components/icons/shopping-cart";

import { cookies } from "next/headers";
import { EventButton } from "../cart/event-button";
import Link from "next/link";
import LogoSquare from "~components/logo-square";
const { SITE_NAME } = process.env;

const OrderPage = async () => {
  const orderNumber = (await cookies()).get("order_number")?.value;
  return (
    <div className="h-[100dvh]">
      <div className="mx-auto w-fit mt-10">
        <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
          <LogoSquare />
          <span className="uppercase">{SITE_NAME}</span>
        </Link>
      </div>
      <div className="mx-auto h-full flex max-w-6xl items-center">
        <div className="flex flex-col items-center justify-center w-full overflow-hidden">
          <BasketCartIcon className="w-48 h-48" />
          <h1 className="my-2 text-4xl font-bold text-center">Your Order Number: {orderNumber}</h1>
          <p className="text-xl translate-x-3">Thank you for your purchase! See You Again</p>
          <h1 className="my-2 text-4xl font-bold text-center">Thank You !</h1>
          <EventButton buttonName="Continue shopping" redirect="/search" />
        </div>
      </div>
    </div>
  );
};
export default OrderPage;
