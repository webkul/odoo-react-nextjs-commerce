import FormPlaceHolder from "components/checkout/place-holder";
import { getCart } from "lib/odoo";
import { cookies } from "next/headers";
import PaymentPage from "~components/checkout/payment";
import { Suspense } from "react";

const payment = async () => {
  const cartId = (await cookies()).get("cartId")?.value;
  let cart;
  if (cartId) {
    cart = await getCart();
  }

  return (
    <Suspense fallback={<FormPlaceHolder />}>
      {" "}
      <PaymentPage cart={cart} />
    </Suspense>
  );
};

export default payment;
