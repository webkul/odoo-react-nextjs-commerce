import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { isArray } from 'lib/type-guards';
import { Field, Input, Label } from '@headlessui/react';
export default function InputText({
  className,
  label,
  name,
  errorMsg, // Add errorMsg prop to handle error messages
  typeName,
  defaultValue
}: {
  className: string;
  label: string;
  name: string;
  errorMsg?: []; // Make errorMsg prop optional
  typeName?: string;
  defaultValue?: string | number;
}) {
  return (
    <div className={clsx('w-full', className)}>
      <Field>
        <Label className="text-sm/6 font-medium text-black dark:text-white">{label}</Label>
        <Input
          placeholder={label}
          name={name}
          type={typeName}
          defaultValue={defaultValue}
          className={clsx(
            'mt-0.5 block w-full rounded-lg border-none bg-slate-200 px-3 py-2 text-sm/6 text-black dark:bg-white/5 dark:text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
        />
      </Field>
      {isArray(errorMsg) && (
        <ul className="py-1 text-sm">
          {errorMsg?.map((msg, errIndex) => (
            <div key={msg + errIndex} className="flex items-stretch gap-1 text-red-500">
              <ExclamationCircleIcon className="h-5 w-5" />
              <li>{msg} </li>
            </div>
          ))}
        </ul>
      )}
    </div>

    // <div className={clsx(' max-w-full ', className)}>
    //   <Input
    //     type={typeName}
    //     size="sm"
    //     label={label}
    //     variant="bordered"
    //     radius="sm"
    //     name={name}
    //     color={errorMsg ? 'danger' : 'primary'} // Set color to 'danger' if errorMsg is present
    //     defaultValue={defaultValue}
    //     className="max-w-full"
    //     classNames={{
    //       base: 'hover:border-primary-500',
    //       inputWrapper: 'border border-[1px] rounded-md dark:border-gray-700',
    //       mainWrapper: 'bg-gray-700',
    //       label: 'text-gray-500'
    //       // errorMessage: "text-red-500"
    //     }}
    //   />
    //   {isArray(errorMsg) && (
    //     <ul className="text-danger py-2 text-sm">
    //       {errorMsg?.map((msg, index) => (
    //         <div className="flex items-stretch gap-1">
    //           <ExclamationCircleIcon className="h-5 w-5" />
    //           <li key={index}>{msg} </li>
    //         </div>
    //       ))}
    //     </ul>
    //   )}
    // </div>
  );
}
