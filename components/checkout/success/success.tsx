import { BasketCartIcon } from 'components/icons/shopping-cart';

import { cookies } from 'next/headers';
import { EventButton } from '../cart/event-button';
const OrderPage = () => {
  const orderNumber = cookies().get('order_number')?.value;
  return (
    <div className="mx-auto flex h-[100dvh] max-w-6xl items-center">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden">
        <BasketCartIcon className="h-48 w-48" />
        <h1 className="my-2 text-center text-4xl font-bold">Your Order Number: {orderNumber}</h1>
        <p className="translate-x-3 text-xl">Thank you for your purchase! See You Again</p>
        <h1 className="my-2 text-center text-4xl font-bold">Thank You !</h1>
        <EventButton buttonName="Continue shopping" redirect="/search" />
      </div>
    </div>
  );
};
export default OrderPage;
