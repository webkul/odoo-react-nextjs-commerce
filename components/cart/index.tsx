import { getCart } from "lib/odoo";
import { cookies } from "next/headers";
import CartModal from "./modal";

export default async function Cart() {
  const cartId = (await cookies()).get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart();
  }

  return <CartModal cart={cart} />;
}
