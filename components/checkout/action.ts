"use server";
import { TAGS } from "lib/constants";
import {
  addPaymentMethod,
  addShippingAddress,
  addShippingMethod,
  createPlaceOrder,
} from "lib/odoo";
import { isObject } from "lib/type-guards";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  PaymentMethodType,
  PlacerOrderInputType,
  ShippingMethodType,
} from "~lib/odoo/types";

const schema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("This is not a valid email."),
  firstname: z
    .string({ required_error: "First Name is required" })
    .min(1, { message: "Please Enter First name" }),
  address1: z
    .string({ required_error: "Address is required" })
    .min(1, { message: "Address is required!" }),
  city: z
    .string({ required_error: "City is required" })
    .min(1, { message: "City is required" }),
  postcode: z
    .string({ required_error: "Zipcode is required" })
    .min(1, { message: "Zip code is required" }),
  telephone: z
    .string({ required_error: "Phone Number is required" })
    .min(1, { message: "Phone Number is required" }),
});

export async function createShippingAddress(
  prevState: any,
  formData: FormData,
) {
  const shippingAddressObj: any = {
    email: formData.get("email"),
    firstname: formData.get("firstname"),
    lastname: formData.get("lastName"),
    company: formData.get("company"),
    country_code: formData.get("country"),
    postcode: formData.get("postcode"),
    street: [
      formData.get("address1"),
      formData.get("address2") || formData.get("address1"),
    ],
    address1: formData.get("address1"),
    city: formData.get("city"),
    telephone: formData.get("telephone"),
    region: { region: "", region_id: formData.get("region") || 0 },
  };

  const validatedFields = schema.safeParse(shippingAddressObj);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  if (shippingAddressObj.address1 !== undefined) {
    delete shippingAddressObj.address1;
  }
  const cartId = (await cookies()).get("cartId")?.value;

  const result = await addShippingAddress({
    cartId: cartId || "",
    input: shippingAddressObj,
  });

  if (result?.success && isObject(result?.setShippingMethodsOnCart)) {
    revalidateTag(TAGS.cart);
    return {
      shippingAddress: {
        ...result?.setShippingMethodsOnCart?.shipping_address,
      },
    };
  }
}

export async function createShippingMethod(prevState: any, formData: FormData) {
  const shippingObj = {
    carrier_code: formData.get("shippingMethods[carrier_code]"),
    method_code: formData.get("shippingMethods[method_code]"),
  };

  const cartId = (await cookies()).get("cartId")?.value;
  const shippingMethods = {
    cartId: cartId,
    shippingMethods: [{ ...shippingObj }],
  };

  const result = await addShippingMethod(shippingMethods as ShippingMethodType);
  if (result?.success && isObject(result?.setShippingMethodsOnCart)) {
    revalidateTag(TAGS.cart);
    redirect("/checkout/payment");
  }
}

export async function createPaymentMethod(prevState: any, formData: FormData) {
  const cartId = (await cookies()).get("cartId")?.value;
  const input = {
    cartId: cartId,
    paymentMethod: {
      code: formData.get("payementMethod[code]"),
    },
  };

  const result = await addPaymentMethod(input as PaymentMethodType);
  if (result?.success && isObject(result?.setPaymentMethodsOnCart)) {
    const placeOrder = {
      cartId: cartId,
      transaction_id: result?.setPaymentMethodsOnCart?.transaction_id,
    };
    const orderInfo = await createPlaceOrder(
      placeOrder as PlacerOrderInputType,
    );
    if (orderInfo?.success && isObject(orderInfo?.placeOrder)) {
      (await cookies()).set(
        "order_number",
        orderInfo?.placeOrder?.order?.order_number,
      );
      (await cookies()).delete("cartId");
      redirect("/success");
    }
  }
}
