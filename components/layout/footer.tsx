import Link from "next/link";
import FooterMenu from "components/layout/footer-menu";
import LogoSquare from "components/logo-square";
import { getFooterLinks } from "lib/odoo";
import { Suspense } from "react";
import FooterMenuPlaceholder from "./footer-placeholder";
import Github from "~components/icons/github";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");

  const menu = await getFooterLinks();
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare size="sm" />
            <span className="uppercase whitespace-nowrap">{SITE_NAME}</span>
          </Link>
        </div>
        <Suspense fallback={<FooterMenuPlaceholder />}>
          <FooterMenu menu={menu} />
        </Suspense>
        <div className="md:ml-auto">
          <a
            className="flex items-center justify-center flex-none h-8 text-xs text-black rounded-md w-max"
            aria-label="Deploy on Vercel"
            target="_blank"
            href="https://github.com/webkul/odoo-react-nextjs-commerce"
          >
            <Github />
          </a>
        </div>
      </div>
      <div className="py-6 text-sm border-t border-neutral-200 dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".") ? "." : ""} All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p>Designed in California</p>
          <p className="md:ml-auto">
            <a href="#" className="text-black dark:text-white">
              Crafted by Odoo Commerce
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
