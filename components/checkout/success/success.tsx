import { BasketCartIcon } from "components/icons/shopping-cart";

import { cookies } from "next/headers";
import { EventButton } from "../cart/event-button";
const OrderPage = async () => {
  const orderNumber = (await cookies()).get("order_number")?.value;
  return (
    <div className="mx-auto flex h-[100dvh] max-w-6xl items-center">
      <div className="flex flex-col items-center justify-center w-full overflow-hidden">
        <BasketCartIcon className="w-48 h-48" />
        <h1 className="my-2 text-4xl font-bold text-center">
          Your Order Number: {orderNumber}
        </h1>
        <p className="text-xl translate-x-3">
          Thank you for your purchase! See You Again
        </p>
        <h1 className="my-2 text-4xl font-bold text-center">Thank You !</h1>
        <EventButton buttonName="Continue shopping" redirect="/search" />
      </div>
    </div>
  );
};
export default OrderPage;
