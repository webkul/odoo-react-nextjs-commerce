import { ReadonlyURLSearchParams } from "next/navigation";
import { isArray, isObject } from "./type-guards";
export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";
export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    "ODOO_STORE_DOMAIN",
    "ODOO_STOREFRONT_ACCESS_TOKEN",
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        "\n",
      )}\n`,
    );
  }

  if (
    process.env.ODOO_STORE_DOMAIN?.includes("[") ||
    process.env.ODOO_STORE_DOMAIN?.includes("]")
  ) {
    throw new Error(
      "Your `ODOO_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.",
    );
  }
};

export const getLocalStorage = (key: string | any, needParsedData = false) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    if (!data || typeof data === "undefined") return null;
    if (needParsedData) return JSON.parse(data);
    return data;
  }
};

/**
 * Remove data from local storage
 *
 * @param {string} storageKey - Key for the storage
 * @returns void
 */
export const removeFromLocalStorage = (storageKey: string | any) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(storageKey);
  }
};

export const setLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    if (isArray(data) || isObject(data)) {
      data = JSON.stringify(data);
    }
    if (typeof data === "string") {
      localStorage.setItem(key, data);
    }
  }
};

export type T = {
  error: [];
};

export const formErrorResolver = (error: Array<T>) => {
  if (isArray(error)) {
    return error;
  }
  return [];
};
