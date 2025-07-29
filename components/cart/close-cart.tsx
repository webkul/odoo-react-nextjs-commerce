import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex items-center justify-center text-black transition-colors border rounded-md h-11 w-11 border-neutral-200 dark:border-neutral-700 dark:text-white">
      <XMarkIcon
        className={clsx(
          "h-6 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
    </div>
  );
}
