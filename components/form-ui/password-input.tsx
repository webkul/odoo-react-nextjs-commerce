import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { isArray } from 'lib/type-guards';
import { Field, Input, Label } from '@headlessui/react';
import { useState } from 'react';
export default function PassowrdInputText({
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
  errorMsg?: any[]; // Make errorMsg prop optional
  typeName?: string;
  defaultValue?: string | number;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={clsx('w-full', className)}>
      <Field>
        <Label className="text-sm/6 font-medium text-black dark:text-white">{label}</Label>
        <div className="relative">
          <Input
            placeholder={label}
            name={name}
            type={!showPassword ? 'text' : typeName}
            defaultValue={defaultValue}
            className={clsx(
              'mt-3 block w-full rounded-lg border-none bg-slate-200 px-3 py-1.5 text-sm/6 text-black dark:bg-white/5 dark:text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
          />
          {typeName === 'password' && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 py-1.5 text-sm/6 text-white"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 stroke-black dark:stroke-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 stroke-black dark:stroke-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}

              {/* <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> */}
            </button>
          )}
        </div>
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
  );
}
