import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { isArray } from "lib/type-guards";
import { Field, Input, Label } from "@headlessui/react";
import { useState } from "react";
import ShowEye from "~components/icons/show-eye";
import HideIcon from "~components/icons/hide-eye";
export default function PassowrdInputText({
  className,
  label,
  name,
  errorMsg, // Add errorMsg prop to handle error messages
  typeName,
  defaultValue,
}: {
  className?: string;
  label: string;
  name: string;
  errorMsg?: any[]; // Make errorMsg prop optional
  typeName?: string;
  defaultValue?: string | number;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={clsx("w-full", className)}>
      <Field>
        <Label className="font-medium text-black text-sm/6 dark:text-white">
          {label}
        </Label>
        <div className="relative">
          <Input
            placeholder={label}
            name={name}
            type={!showPassword ? "text" : typeName}
            defaultValue={defaultValue}
            className={clsx(
              "mt-3 block w-full rounded-lg border-none bg-slate-200 px-3 py-1.5 text-sm/6 text-black dark:bg-white/5 dark:text-white",
              "focus:outline-hidden data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
            )}
          />
          {typeName === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 py-1.5 text-sm/6 text-white"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <ShowEye/>
              ) : (
                <HideIcon/>
              )}

              {/* <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> */}
            </button>
          )}
        </div>
      </Field>
      {isArray(errorMsg) && (
        <ul className="py-1 text-sm">
          {errorMsg?.map((msg, errIndex) => (
            <div
              key={msg + errIndex}
              className="flex items-stretch gap-1 text-sm text-red-500"
            >
              <ExclamationCircleIcon className="w-5 h-5" />
              <li>{msg} </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
