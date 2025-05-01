"use client";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import RegionDropDown from "components/checkout/region-drop-down";
import { ProceedToCheckout } from "../cart/proceed-to-checkout";
import Selectbox from "../../form-ui/select-box";
import InputText from "../../form-ui/input";
import { useActionState, useEffect, useState } from "react";
import { createShippingAddress } from "../action";
import TextInputArea from "components/form-ui/textarea";
import { ShippingArrayDataType } from "lib/odoo/types";
import { isObject } from "lib/type-guards";
import { useRouter } from "next/navigation";
import { formErrorResolver, getLocalStorage, setLocalStorage } from "lib/utils";
import { SAVED_LOCAL_STORAGE } from "lib/constants";
import { useSession } from "next-auth/react";

const GuestCheckOutForm = ({
  countries,
}: {
  countries: ShippingArrayDataType[];
}) => {
  const values = getLocalStorage(SAVED_LOCAL_STORAGE, true);
  const { data: session } = useSession();

  const initialState = {
    ...values,
    firstname:
      values?.firstname ||
      (session?.user?.name ? session.user.name.split(" ")[0] : ""),
    lastname:
      values?.lastname ||
      (session?.user?.name ? session.user.name.split(" ")[1] : ""),
    email: values?.email || session?.user?.email || "",
  };

  const router = useRouter();
  const [state, formAction] = useActionState(
    createShippingAddress,
    initialState,
  );
  const [isSaved, setEnabled] = useState(true);
  useEffect(() => {
    if (isObject(state?.shippingAddress)) {
      setLocalStorage(SAVED_LOCAL_STORAGE, {
        ...state?.shippingAddress,
        isSaved,
      });
      router.push("/checkout/shipping");
    }
  }, [state, isSaved, router]);

  return (
    <form className="my-5" action={formAction}>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Contact</h1>
        <InputText
          className="max-w-full"
          name="email"
          defaultValue={initialState?.email}
          errorMsg={formErrorResolver(state?.errors?.email)}
          label="Enter Email"
        />
      </div>
      <div className="grid grid-cols-6 gap-4 mt-3 mb-7">
        <h1 className="col-span-6 text-2xl font-bold">Shipping address</h1>
        <InputText
          className="col-span-3"
          name="firstname"
          defaultValue={initialState?.firstname}
          errorMsg={formErrorResolver(state?.errors?.firstname)}
          label="First Name"
        />
        <InputText
          className="col-span-3"
          name="lastName"
          label="Last Name"
          defaultValue={initialState?.lastname}
        />
        <InputText
          className="col-span-6"
          name="company"
          label="Company"
          defaultValue={initialState?.company}
        />

        <TextInputArea
          classProps="col-span-3"
          placeholder="Enter Address"
          label="Address"
          name="address1"
          defaultValue={initialState?.street?.[0]}
          errorMsg={state?.errors?.address1}
        />
        <TextInputArea
          classProps="col-span-3"
          placeholder="Apartment, suite, etc (optional)"
          label="Apartment (optional)"
          name="address2"
          defaultValue={initialState?.street?.[1]}
        />
        <Selectbox
          countries={countries}
          className="col-span-3"
          nameAttr="country"
          defaultvalue={initialState?.country?.code || "US"}
          label="Country/Region"
        />
        <InputText
          className="col-span-3"
          name="telephone"
          label="Telephone"
          defaultValue={initialState?.telephone}
          errorMsg={formErrorResolver(state?.errors?.telephone)}
        />

        <InputText
          className="col-span-2"
          name="city"
          label="City"
          defaultValue={initialState?.city}
          errorMsg={formErrorResolver(state?.errors?.city)}
        />
        <RegionDropDown
          countries={countries}
          className="col-span-2"
          label="Select Region"
          nameAttr="region"
        />
        <InputText
          className="col-span-2"
          name="postcode"
          label="Zip Code"
          defaultValue={initialState?.postcode}
          errorMsg={formErrorResolver(state?.errors?.postcode)}
        />

        <div className="flex col-span-6 gap-2">
          <Checkbox
            checked={isSaved}
            onChange={setEnabled}
            className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-inset ring-gray-400 data-[checked]:bg-black dark:ring-white/15 data-[checked]:dark:bg-white"
          >
            <CheckIcon className="hidden size-4 fill-white group-data-[checked]:block dark:fill-black" />
          </Checkbox>
          <span className="text-black dark:text-white">
            Save this information for next time
          </span>
        </div>
        <div className="flex justify-end w-full col-span-6">
          <div className="w-full sm:w-2/5">
            <ProceedToCheckout buttonName="Continue to Shipping" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default GuestCheckOutForm;
