import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex items-center justify-center text-black transition-colors border rounded-md h-11 w-11 border-neutral-200 dark:border-neutral-700 dark:text-white">
      <ShoppingCartIcon
        className={clsx(
          "h-4 transition-all ease-in-out hover:scale-110 ",
          className,
        )}
      />

      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded-sm bg-blue-600 text-[11px] font-medium text-white">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
