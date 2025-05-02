import { Field, Label, Textarea } from "@headlessui/react";
import clsx from "clsx";
import { isArray } from "lib/type-guards";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function TextInputArea({
  classProps,
  placeholder,
  label,
  errorMsg,
  name,
  defaultValue,
}: {
  classProps?: string;
  placeholder: string;
  label?: string;
  errorMsg?: any;
  name: string;
  defaultValue?: string;
}) {
  return (
    <div className={clsx("w-full", classProps)}>
      <Field>
        {label && (
          <Label className="font-medium text-black text-sm/6 dark:text-white">
            {label}
          </Label>
        )}

        <Textarea
          placeholder={placeholder}
          name={name}
          defaultValue={defaultValue}
          className={clsx(
            "mt-1.5 block w-full resize-none rounded-lg border-none bg-slate-200 px-3 py-1.5 text-sm/6 text-black dark:bg-white/5 dark:text-white",
            "focus:outline-hidden data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
          )}
          rows={2}
        />
        {isArray(errorMsg) && (
          <ul className="py-1 text-sm">
            {errorMsg?.map((msg: string, index: number) => (
              <div
                key={index}
                className="flex items-stretch gap-1 text-sm text-red-500"
              >
                <ExclamationCircleIcon className="w-5 h-5" />
                <li key={index}>{msg} </li>
              </div>
            ))}
          </ul>
        )}
      </Field>
    </div>
  );
}
