"use client";

import clsx from "clsx";
import { Menu } from "lib/odoo/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FooterMenuItem = ({ item }: { item: Menu }) => {
  const pathname = usePathname();

  return (
    <li>
      <h1
        className={clsx(
          "block p-2 text-lg text-black  underline-offset-4  md:inline-block md:text-sm dark:text-neutral-300"
        )}
      >
        {item.title}
      </h1>
      <ul>
        {item.path.map((pathUrl, index) => (
          <li key={`${item.title}${index}`}>
            <Link
              href={pathUrl?.type === "page" ? `/${pathUrl?.url_key}` : `/search/${pathUrl?.url_key}`}
              className={clsx(
                "block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300",

                pathname === `/${pathUrl?.url_key}` && "text-black dark:text-neutral-300"
              )}
            >
              {pathUrl?.title}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <span className="flex flex-wrap justify-start items-start w-full gap-6 text-sm text-black dark:text-neutral-300">
      {menu.map((item: Menu, menuIndex) => (
        <nav key={menuIndex}>
          <ul>
            <FooterMenuItem key={item.title} item={item} />
          </ul>
        </nav>
      ))}
    </span>
  );
}
