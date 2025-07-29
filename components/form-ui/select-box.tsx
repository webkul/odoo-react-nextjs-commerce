import clsx from "clsx";
import { Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ShippingArrayDataType } from "lib/odoo/types";
import { useGlobalContext } from "app/context/store";
export default function Selectbox({
  className,
  countries,
  nameAttr,
  label,
  defaultvalue,
}: {
  className: string;
  countries: ShippingArrayDataType[];
  nameAttr: string;
  label: string;
  defaultvalue: string;
}) {
  const { setCountryCode } = useGlobalContext();
  const getKeyValue = (countryCode: string) => {
    setCountryCode(countryCode);
  };
  return (
    <div className={clsx("w-full", className)}>
      <Field>
        <Label className="font-medium text-black text-sm/6 dark:text-white">
          {label}
        </Label>
        <div className="relative">
          <Select
            className={clsx(
              "mt-3 block w-full appearance-none rounded-lg border-none bg-slate-200 px-3 py-2 text-sm/6 text-black dark:bg-white/5 dark:text-white",
              "focus:outline-hidden data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              // Make the text of each option black on Windows
              "*:text-black",
            )}
            name={nameAttr}
            onChange={(e) => getKeyValue(e.target.value)}
            defaultValue={defaultvalue}
          >
            {countries?.map((country, ctyIndex) => (
              <option key={ctyIndex} value={country?.id}>
                {country.full_name_english}
              </option>
            ))}
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute right-2.5 top-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  );
}
