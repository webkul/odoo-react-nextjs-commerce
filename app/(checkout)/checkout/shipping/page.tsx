import FormPlaceHolder from 'components/checkout/place-holder';
import { getCart } from 'lib/odoo';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
const ShippingMethod = dynamic(() => import('components/checkout/shipping'), {
  loading: () => <FormPlaceHolder />,
  ssr: false
});
const Shipping = async () => {
  const cartId = cookies().get('cartId')?.value;
  let cart;
  if (cartId) {
    cart = await getCart(cartId);
  }
  return <ShippingMethod cartData={cart} />;
};
export default Shipping;
export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Checkout with store items'
};
