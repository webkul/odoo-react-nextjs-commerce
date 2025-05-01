import clsx from "clsx";
import { isArray } from "lib/type-guards";
import { Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ShippingArrayDataType } from "lib/odoo/types";
import { useGlobalContext } from "app/context/store";
export default function Selectbox({
  countries,
  className,
  label,
  nameAttr,
}: {
  countries: ShippingArrayDataType[];
  className: string;
  label: string;
  nameAttr: string;
}) {
  const { countryCode } = useGlobalContext();
  const stateArray = countries.find(
    (country: ShippingArrayDataType) => country.id === countryCode,
  );

  return (
    <div className={clsx("w-full", className)}>
      <Field disabled={!isArray(stateArray?.available_regions)}>
        {label && (
          <Label className="font-medium text-black text-sm/6 dark:text-white">
            {label}
          </Label>
        )}
        <div className="relative">
          <Select
            className={clsx(
              "mt-3 block w-full appearance-none rounded-lg border-none bg-slate-200 px-3 py-1.5 text-sm/6 text-black dark:bg-white/5 dark:text-white",
              "focus:outline-hidden data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              // Make the text of each option black on Windows
              "*:text-black",
            )}
            name={nameAttr}
          >
            {!isArray(stateArray?.available_regions) && (
              <option key={0} value="0">
                No Fount Region
              </option>
            )}

            {stateArray?.available_regions?.map((country, ctyIndex) => (
              <option key={ctyIndex + 1} value={country?.id}>
                {country.name}
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
