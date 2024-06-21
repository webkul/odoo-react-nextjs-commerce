import FormPlaceHolder from 'components/checkout/place-holder';
import { getCart } from 'lib/odoo';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';

const PaymentPage = dynamic(() => import('components/checkout/payment'), {
  loading: () => <FormPlaceHolder />,
  ssr: false
});
const payment = async () => {
  const cartId = cookies().get('cartId')?.value;
  let cart;
  if (cartId) {
    cart = await getCart(cartId);
  }

  return <PaymentPage cart={cart} />;
};

export default payment;
