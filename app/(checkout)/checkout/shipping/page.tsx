import FormPlaceHolder from "components/checkout/place-holder";
import { getCart } from "lib/odoo";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import ShippingMethod from "~components/checkout/shipping";

const Shipping = async () => {
  const cartId = (await cookies()).get("cartId")?.value;
  let cart;
  if (cartId) {
    cart = await getCart();
  }
  return (
    <Suspense fallback={<FormPlaceHolder />}>
      <ShippingMethod cartData={cart} />
    </Suspense>
  );
};
export default Shipping;
export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout with store items",
};
