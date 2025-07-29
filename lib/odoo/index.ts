import {
  LIMIT,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
  TOKEN,
} from "lib/constants";
import { isArray, isObject, isShopifyError } from "lib/type-guards";
import { ensureStartsWith } from "lib/utils";
import {
  revalidateTag,
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
} from "next/cache";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import { getProductRecommendationsQuery } from './queries/product';
import {
  Cart,
  Collection,
  CreateCartType,
  FooterSubLinks,
  MegaMenu,
  Menu,
  OdooFetchVariables,
  OdooFooterMenuOperation,
  OdooHomeCollection,
  OdooHomepageCollection,
  OdooProduct,
  OdooProductsOperation,
  Page,
  Product,
  ProductVariant,
  OdooAddToCartOperation,
  OdooCart,
  OdooCartOperation,
  OdooCollection,
  OdooCollectionOperation,
  OdooCollectionsOperation,
  OdooCreateCartOperation,
  OdooMenuOperation,
  OdooPageOperation,
  OdooProductOperation,
  OdooRemoveFromCartOperation,
  OdooUpdateCartOperation,
  OdooCountriesOperation,
  ShippingArrayDataType,
  shippingAddressType,
  ShippingMethodType,
  PaymentMethodType,
  PlacerOrderInputType,
  RegisterInputType,
  RecoverLoginType,
  ShippingAddressInputType,
  ShippingMethodDataType,
  PaymentMethodDataType,
  PlacerOrderDataType,
  RegisterDataType,
} from "./types";

const domain = process.env.ODOO_STORE_DOMAIN
  ? ensureStartsWith(process.env.ODOO_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.ODOO_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function odooFetch<T>({
  headers,
  query,
  cartId,
  method = "GET",
  variables,
  is_session,
}: {
  headers?: HeadersInit;
  query: string;
  cartId?: string;
  method?: string;
  variables?: ExtractVariables<T>;
  is_session?: boolean;
}): Promise<{ status: number; body: T } | never> {
  try {
    let session;
    if (is_session) {
      session = (await cookies()).get(TOKEN)?.value;
    }

    if (isObject(headers) && session) {
      headers["Authorization"] = `bearer ${session}`;
    }
    const result = await fetch(`${endpoint}/${query}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        cartId: `${cartId ? `${cartId}` : ""}`,
        Authenticate: key,
        ...(session ? { Authorization: `bearer ${session}` } : {}),
        ...headers,
      },
      body:
        variables &&
        JSON.stringify({
          ...(variables && variables),
        }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

const removeEdgesAndNodes = (array: Array<any>) => {
  return array.map((edge) => edge);
};

const reshapeCart = (cart: OdooCart): any => {
  // if (!cart.prices?.totalTaxAmount) {
  //   cart.cost.totalTaxAmount = {
  //     amount: '0.0',
  //     currencyCode: 'USD'
  //   };
  // }
  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.items),
  };
};

const reshapeCollection = (
  collection?: OdooCollection,
): Collection | undefined => {
  if (!isObject(collection)) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.url_key}`,
  };
};

const reshapeCollections = (collections: OdooCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);
      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: ProductVariant[], productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.thumbnail.name.match(/.*\/(.*)\..*/)[1];
    return {
      ...image.thumbnail,
      altText: image.thumbnail.name || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product?: OdooProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (!product || filterHiddenProducts) {
    return undefined;
  }
  const { variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(variants, product.name),
    variants: removeEdgesAndNodes(variants),
  };
};

const reshapeProducts = (products: OdooProduct[]) => {
  const reshapedProducts = [];
  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product, false);
      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

const reshapeHomeProducts = (products: OdooHomeCollection): any[] => {
  const reshapedProducts = [];

  if (isObject(products)) {
    if (isObject(products?.promotionBanner)) {
      reshapedProducts.push(products?.promotionBanner);
    }

    if (isObject(products?.featuredProductCarousel)) {
      reshapedProducts.push(products?.featuredProductCarousel);
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<CreateCartType> {
  const res = await odooFetch<OdooCreateCartOperation>({
    query: "create-empty-cart",
    method: "POST",
    is_session: true,
  });

  return res.body?.data?.customerCart;
}

export async function addToCart(itemObject: {
  cartItems: {
    id: number;
    quantity: number;
  }[];
}): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await odooFetch<OdooAddToCartOperation>({
    query: "addtocart",
    method: "POST",
    variables: {
      ...itemObject,
      cartId,
    },
    is_session: true,
  });

  return reshapeCart(res.body?.customerCart);
}

export async function removeFromCart(removeCartObj: {
  cartItemId: number;
}): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await odooFetch<OdooRemoveFromCartOperation>({
    query: "remove-cart",
    method: "DELETE",
    variables: {
      ...removeCartObj,
      cartId,
    },
    is_session: true,
  });

  return reshapeCart(res.body.removeCart);
}

export async function updateCart(updateCartObj: {
  cartItems: {
    cart_item_id: number;
    quantity: number;
  }[];
}): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await odooFetch<OdooUpdateCartOperation>({
    query: "updatecart",
    method: "POST",
    variables: {
      ...updateCartObj,
      cartId,
    },
    is_session: true,
  });

  return reshapeCart(res.body.updateCart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await odooFetch<OdooCartOperation>({
    query: "cart",
    method: "GET",
    cartId: cartId,
    is_session: true,
  });

  // Old carts becomes `null` when you checkout.
  if (!isObject(res.body.customerCart)) {
    return undefined;
  }
  return reshapeCart(res.body.customerCart);
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const res = await odooFetch<OdooCollectionOperation>({
    query: "category-list",
    method: "POST",
    variables: {
      filter: {
        url_key: {
          eq: handle,
        },
      },
    },
  });

  return reshapeCollection(res.body.category?.[0]);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  page,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  page: string;
}): Promise<Product> {
  "use cache";
  let handle: OdooFetchVariables = {
    search: "",
    pageSize: 12,
    currentPage: page,
  };

  if (sortKey) {
    const direction = reverse ? "desc" : "asc";
    handle = { sort: { [sortKey.toLowerCase()]: direction }, ...handle };
  }
  if (collection) {
    handle = { filter: { category_url: { eq: collection } }, ...handle };
  }
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  const res = await odooFetch<OdooProductsOperation>({
    query: "product-list",
    method: "POST",
    variables: {
      ...handle,
    },
  });

  if (!isArray(res.body.products.items)) {
    return { products: [], total: 0 };
  }

  return {
    products: reshapeProducts(removeEdgesAndNodes(res.body.products.items)),
    total: res.body.total_count ?? 0,
  };
}

export async function getHomepageCollectionProducts(): Promise<
  OdooHomeCollection[] | any[]
> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  const res = await odooFetch<OdooHomepageCollection>({
    query: "homepage",
  });

  if (!res.body.getHomePageData) {
    return [];
  }

  return reshapeHomeProducts(res.body.getHomePageData);
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const res = await odooFetch<OdooCollectionsOperation>({
    query: "category-list",
    method: "POST",
  });

  const odooCollections = removeEdgesAndNodes(res?.body?.category);

  const collections = [
    {
      url_key: "",
      title: "",
      name: "All",
      description: "All products",
      meta_title: "All",
      meta_description: "All products",
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(odooCollections).filter(
      (collection) => !collection.url_key.startsWith("hidden"),
    ),
  ];
  return collections;
}

export async function getMenu(): Promise<MegaMenu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");
  const res = await odooFetch<OdooMenuOperation>({
    query: "mega-menu",
    method: "GET",
  });

  return res.body?.data?.megaMenu.map(
    (item: { title: string; url_key: string }) => {
      if (item?.url_key !== "/") {
        return {
          title: item?.title,
          path: `/search/${item.url_key
            .replace(domain, "")
            .replace("/collections", "/search")
            .replace("/pages", "/search")}`,
        };
      } else {
        return {
          title: "All",
          path: "/search",
        };
      }
    },
  );
}

export async function getFooterLinks(): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");
  const res = await odooFetch<OdooFooterMenuOperation>({
    query: "footer",
    method: "GET",
  });

  return (
    res?.body?.footerLinks.map(
      (item: {
        updatedAt?: string;
        title: string;
        subLinks: FooterSubLinks[];
      }) => ({
        title: item.title,
        path: item.subLinks,
        updateAt: new Date(),
      }),
    ) || []
  );
}

export async function getPage(handle: { identifier: string }): Promise<Page> {
  const res = await odooFetch<OdooPageOperation>({
    query: "cms",
    method: "POST",
    variables: { ...handle },
  });

  return res.body.cmsPage;
}

export async function getPages(): Promise<FooterSubLinks[]> {
  const res = await odooFetch<OdooFooterMenuOperation>({
    query: "footer",
    method: "GET",
  });
  const flattenedSubLinks: FooterSubLinks[] = res.body.footerLinks.flatMap(
    (item) => item.subLinks,
  );

  return removeEdgesAndNodes(flattenedSubLinks);
}

export async function getProduct(pathUrl: string): Promise<Product> {
  "use cache";
  const handle = { filter: { url_key: { eq: pathUrl } } };

  cacheTag(TAGS.products);
  cacheLife("days");

  const res = await odooFetch<OdooProductOperation>({
    query: "product-list",
    method: "POST",
    variables: {
      ...handle,
    },
  });
  if (!isArray(res.body.products.items)) {
    return { products: [], total: 0 };
  }

  return {
    products: reshapeProducts(removeEdgesAndNodes(res.body.products.items)),
    total: res.body.total_count ?? 0,
  };
}

// export async function getProductRecommendations(productId: string): Promise<Product[]> {
//   const res = await odooFetch<OdooProductRecommendationsOperation>({
//     query: getProductRecommendationsQuery,
//     tags: [TAGS.products],
//     variables: {
//       productId
//     }
//   });

//   return reshapeProducts(res.body.data.productRecommendations);
// }

export async function getProducts({
  query,
  reverse,
  sortKey,
  page,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  page?: string;
}): Promise<Product> {
  "use cache";
  let handle: OdooFetchVariables = {
    pageSize: LIMIT,
    currentPage: page || "1",
    filter: {},
  };

  if (sortKey) {
    const direction = reverse ? "desc" : "asc";
    handle = { sort: { [sortKey.toLowerCase()]: direction }, ...handle };
  }
  if (query) {
    handle = { search: query, ...handle };
  }

  cacheTag(TAGS.products);
  cacheLife("days");
  const res = await odooFetch<OdooProductsOperation>({
    query: "product-list",
    method: "POST",
    variables: {
      ...handle,
    },
  });
  if (!isArray(res.body.products.items)) {
    return {
      products: [],
      total: 0,
    };
  }

  return {
    products: reshapeProducts(removeEdgesAndNodes(res.body.products.items)),
    total: res.body.total_count ?? 0,
  };
}
/**
 * Return Country Array
 * @returns
 */
export async function getCountryList(): Promise<ShippingArrayDataType[]> {
  const res = await odooFetch<OdooCountriesOperation>({
    query: "country",
    method: "POST",
  });
  return res.body?.countries;
}

export async function addShippingAddress(
  shippingAddressInput: ShippingAddressInputType,
): Promise<shippingAddressType> {
  const res = await odooFetch<shippingAddressType>({
    query: "add-shipping-address",
    method: "POST",
    variables: {
      ...shippingAddressInput,
    },
    is_session: true,
  });

  return res.body;
}

export async function addShippingMethod(
  input: ShippingMethodType,
): Promise<ShippingMethodDataType> {
  const res = await odooFetch<ShippingMethodDataType>({
    query: "add-delivery-method",
    method: "POST",
    variables: {
      ...input,
    },
    is_session: true,
  });

  return res.body;
}

export async function addPaymentMethod(
  input: PaymentMethodType,
): Promise<PaymentMethodDataType> {
  const res = await odooFetch<PaymentMethodDataType>({
    query: "add-payment-method",
    method: "POST",
    variables: {
      ...input,
    },
    is_session: true,
  });

  return res?.body;
}

export async function createPlaceOrder(
  input: PlacerOrderInputType,
): Promise<PlacerOrderDataType> {
  const res = await odooFetch<PlacerOrderDataType>({
    query: "place-order",
    method: "POST",
    variables: {
      ...input,
    },
    is_session: true,
  });

  return res.body;
}

export async function createUserToLogin(
  input: RegisterInputType,
): Promise<RegisterDataType> {
  const res = await odooFetch<RegisterDataType>({
    query: "signup",
    method: "POST",
    variables: {
      ...input,
    },
  });

  return res?.body;
}

export async function recoverUserLogin(input: {
  email: string;
}): Promise<RecoverLoginType> {
  const res = await odooFetch<RecoverLoginType>({
    query: "forgetPassword",
    method: "POST",
    variables: {
      ...input,
    },
  });
  return res.body;
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const topic = (await headers()).get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.ODOO_REVALIDATION_SECRET) {
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
