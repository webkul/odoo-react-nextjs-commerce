'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/odoo';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(prevState: any, selectedVariantId: number | undefined) {
  let cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    cookies().set('cartId', cartId, { httpOnly: true, secure: false });
  }

  if (!selectedVariantId) {
    return 'Missing product variant ID';
  }

  try {
    await addToCart({ cartId: cartId, cartItems: [{ id: selectedVariantId, quantity: 1 }] });
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: number) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    await removeFromCart({ cartItemId: lineId, cartId: cartId });
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: number;
    variantId: number;
    quantity: number;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart({ cartItemId: lineId, cartId: cartId });
      revalidateTag(TAGS.cart);
      return;
    }

    await updateCart({
      cartId: cartId,
      cartItems: [{ cart_item_id: variantId, quantity: quantity }]
    });
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
