import { GeistSans } from "geist/font/sans";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import "./globals.css";
import NextAuthProvider from "./next-auth-provider";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {


  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="text-black bg-neutral-50 selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <main>
          <NextAuthProvider> {children} </NextAuthProvider>
        </main>
      </body>
    </html>
  );
}
