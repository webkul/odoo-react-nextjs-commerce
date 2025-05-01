import { getCollections, getPages, getProducts } from "lib/odoo";
import { baseUrl, validateEnvironmentVariables } from "lib/utils";
import { MetadataRoute } from "next";

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = [""].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => ({
      url: `${baseUrl}${collection.path}`,
      lastModified: collection.updatedAt,
    })),
  );

  const productsPromise = getProducts({}).then((products) =>
    products.products.map((product) => ({
      url: `${baseUrl}/product/${product?.url_key}`,
      lastModified: product.updatedAt,
    })),
  );

  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => {
      if (page?.type === "page") {
        return {
          url: `${baseUrl}/${page?.url_key}`,
          lastModified: page.updateAt,
        };
      } else {
        return {
          url: `${baseUrl}/search/${page?.url_key}`,
          lastModified: page.updateAt,
        };
      }
    }),
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, pagesPromise])
    ).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
