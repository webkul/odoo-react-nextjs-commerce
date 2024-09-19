export type Maybe<T> = T | null;
export type Window = {
  isLogOutLoading?: boolean;
};

export type Connection<T> = {
  items: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<OdooCart, 'lines'> & {
  lines: any;
  prices: {
    applied_taxes: {
      name: string;
      value: number;
      currency: string;
    }[];
  };
  discounts: [];
  order_currency: string;
  order_currency_id: number;
  grand_total: {
    currency: string;
    value: number;
  };
  subtotal_excluding_tax: {
    currency: string;
    value: number;
  };
  cartItemId: number;
  quantity: number;
  product: {
    name: string;
    sku: string;
    url_key: string;
    in_stock: boolean;
    short_description: string;
    thumbnail: Image;
    prices: {
      price: {
        currency: string;
        value: number;
      };
      row_total: {
        currency: string;
        value: number;
      };
      row_total_including_tax: {
        currency: string;
        value: number;
      };
      total_item_discount: {
        currency: string;
        value: number;
      };
      discounts: string;
    };
  };
  configurable_options: [
    {
      option_label: string;
      value_label: string;
    },
    {
      option_label: string;
      value_label: string;
    }
  ];
};

export type CartItem = {
  cartItemId: number;
  quantity: number;
  product: {
    name: string;
    sku: string;
    url_key: string;
    in_stock: boolean;
    short_description: string;
    thumbnail: Image;
    prices: {
      price: {
        currency: string;
        value: number;
      };
      row_total: {
        currency: string;
        value: number;
      };
      row_total_including_tax: {
        currency: string;
        value: number;
      };
      total_item_discount: {
        currency: string;
        value: number;
      };
      discounts: string;
    };
  };
  configurable_options: [
    {
      option_label: string;
      value_label: string;
    },
    {
      option_label: string;
      value_label: string;
    }
  ];
};

export type Collection = {
  path: string;
  url_key: string;
  name: string;
  description: string;
  meta_title: string;
  meta_description: string;
  updatedAt: string;
  title: string;
};

export type Image = {
  id: string;
  name: string;
  label: string;
  in_stock: true;
  short_description?: string;
  url: string;
};

export type MegaMenu = {
  title: string;
  path: string;
};

export type Menu = {
  title: string;
  path: FooterSubLinks[];
  updatedAt?: string;
};

export type FooterSubLinks = {
  uid: number;
  type: string;
  title: string;
  url_key: string;
  updateAt: string;
};

export type Money = {
  regular_price: {
    currency: string;
    value: number;
  };
  final_price: {
    currency: string;
    value: number;
  };
  discount: {
    amount_off: number;
    percent_off: number;
  };
  fixed_product_taxes: [];
};

export type Page = {
  contentHeading: string;
  urlKey: string;
  title: string;
  content: string;
  identifier: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  createdAt?: string;
  updatedAt?: string;
};

export type productListType = Omit<OdooProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
};
export type Product = {
  products: productListType[];
  total: number;
};

export type ProductOption = {
  uid: number;
  label: string;
  position: string;
  attribute_code: string;
  values: {
    label: string;
    uid: number;
  }[];
};

export type ProductVariant = {
  id: number;
  sku: string;
  name: string;
  description: string;
  thumbnail: Image;
  price_range: {
    minimum_price: Money;
    maximum_price: Money;
  };
  attributes: { uid: number; label: string; code: string; value_index: number }[];
};

export type SEO = {
  title: string;
  description: string;
};

export type OdooCart = {
  id: string;
  email: string;
  total_quantity: number;
  transaction_id: string;
  available_payment_methods: [
    {
      title: string;
      code: string;
    }
  ];

  selected_payment_method: {
    code: string;
    purchase_order_number: string;
    title: string;
  };
  applied_coupons: string;
  items: CartItem[];

  prices: {
    applied_taxes: [
      {
        name: string;
        value: number;
        currency: string;
      }
    ];
    discounts: [];
    order_currency: string;
    order_currency_id: number;
    grand_total: {
      currency: string;
      value: number;
    };
    subtotal_excluding_tax: {
      currency: string;
      value: number;
    };
  };
  shipping_address: {
    city: string;
    firstname: string;
    middlename: string;
    lastname: string;
    street: string[];
    company: string;
    postcode: string;
    telephone: string;
    country: {
      code: string;
      label: string;
    };
    region: {
      code: string;
      label: string;
      region_id: string;
    };
    available_shipping_methods: [
      {
        amount: {
          currency: string;
          value: string;
        };
        available: true;
        carrier_code: number;
        carrier_title: string;
        error_message: string;
        method_code: 1;
        method_title: string;
      },
      {
        amount: {
          currency: string;
          value: string;
        };
        available: true;
        carrier_code: number;
        carrier_title: string;
        error_message: '';
        method_code: 2;
        method_title: string;
      }
    ];
    selected_shipping_method: {
      carrier_title: string;
      amount: {
        currency: string;
        value?: number;
      };
    };
  };
  billing_address: {
    city: string;
    firstname: string;
    middlename: string;
    lastname: string;
    street: string[];
    company: string;
    postcode: string;
    telephone: string;
    country: {
      code: string;
      label: string;
    };
    region: {
      code: string;
      label: string;
      region_id: string;
    };
  };
};

export type shippingAddressType = {
  setShippingMethodsOnCart: OdooCart;
  success: boolean;
  variables: {
    cartId: string;
    input: {
      email: string;
      firstname: string;
      lastname: string;
      company: string;
      country_code: string;
      postcode: string;
      street: string[];
      city: string;
      telephone: string;
      region: { region: string; region_id: number };
    };
  };
};

export type OdooCollection = {
  uid: string;
  name: string;
  title: string;
  description: string;
  url_key: string;
  meta_description: string;
  meta_title: string;
  meta_keywords: string;
  url_suffix: string;
  updatedAt: string;
};

export type OdooProduct = {
  url_key: string;
  id: number;
  sku: string;
  name: string;
  description: string;
  in_stock: true;
  short_description: string;
  thumbnail: Image;
  price_range: {
    minimum_price: Money;
    maximum_price: Money;
  };
  configurable_options: ProductOption[];
  variants: ProductVariant[];
  updatedAt: string;
};

export type OdooCartOperation = {
  customerCart: OdooCart;
  variables: {
    cartId: string;
    is_session: boolean;
  };
};

export type CreateCartType = {
  id: string;
};
export type OdooCreateCartOperation = {
  data: {
    customerCart: {
      id: string;
    };
  };
};

export type OdooAddToCartOperation = {
  customerCart: OdooCart;
  variables: {
    cartId: string;
    cartItems: {
      id: number;
      quantity: number;
    }[];
  };
};

export type OdooRemoveFromCartOperation = {
  removeCart: OdooCart;
  variables: {
    cartItemId: number;
    cartId: string;
  };
};

export type OdooUpdateCartOperation = {
  updateCart: OdooCart;
  variables: {
    cartId: string;
    cartItems: {
      cart_item_id: number;
      quantity: number;
    }[];
  };
};

export type OdooCollectionOperation = {
  category: OdooCollection[];
  variables: {
    filter: {
      url_key: {
        eq: string;
      };
    };
  };
};

export type OdooCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<OdooProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type OdooPermotionItems = {
  id: number;
  bannerType: string;
  bannerNameType: string;
  dominantColor: string;
  name: string;
  url: string;
  urlKey: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
};
export type OdooPromotionBannerType = {
  title: string;
  description: string;
  layoutType: string;
  items: OdooPermotionItems[];
};

export type OdooFeatureProductListType = {
  review_count: string;
  rating_summary: string;
  url_key: string;
  id: string;
  sku: string;
  name: string;
  description: string;
  in_stock: boolean;
  short_description: string;
  thumbnail: {
    id: string;
    name: string;
    label: string;
  };
  price_range: {
    minimum_price: {
      regular_price: {
        currency: string;
        value: number;
      };
      final_price: {
        currency: string;
        value: number;
      };
      discount: {
        amount_off: string;
        percent_off: string;
      };
      fixed_product_taxes: [];
    };
  };
};
export type OdooFeatureProductType = {
  id: number;
  description: string;
  image: string;
  label: string;
  productList: OdooFeatureProductListType[];
};

export type OdooHomeCollection = {
  promotionBanner: OdooPromotionBannerType;
  featuredProductCarousel: OdooFeatureProductType;
};

export type OdooHomepageCollection = {
  getHomePageData: OdooHomeCollection;
};

export type OdooCollectionsOperation = {
  category: OdooCollection[];
  variables: { filter: {} };
};

export type OdooMenuOperation = {
  data: {
    megaMenu: [
      {
        category_id: number;
        title: string;
        url_key: string;
        parent_id: number;
        image_url: string;
        position: string;
        path: string;
        item_id: number;
        display_mode: string;
      }
    ];
  };
};

export type OdooFooterMenu = {
  title: string;
  uid: number;
  subLinks: FooterSubLinks[];
};

export type OdooFooterMenuOperation = {
  footerLinks: OdooFooterMenu[];
};

export type OdooPageOperation = {
  cmsPage: Page;
  variables: { identifier: string };
};

export type OdooPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type OdooProductOperation = {
  products: {
    items: OdooProduct[];
  };
  total_count: number;
  variables: { filter: { url_key: { eq: string } } };
};

export type OdooProductRecommendationsOperation = {
  data: {
    productRecommendations: OdooProduct[];
  };
  variables: {
    productId: string;
  };
};

export type OdooFetchVariables = {
  pageSize: number;
  currentPage: string;
  filter?: {};
  sort?: { [key: string]: string };
  search?: string;
};

export type OdooProductsOperation = {
  products: Connection<OdooProduct>;
  variables: OdooFetchVariables;
  total_count: number;
};

export type CountryRegionArray = {
  id: number;
  code: string;
  name: string;
};

export type ShippingArrayDataType = {
  id: string;
  full_name_english: number;
  available_regions: CountryRegionArray[];
};

export type OdooCountriesOperation = {
  countries: ShippingArrayDataType[];
};

export type StateArrayDataType = {
  id: string;
  countryCode: string;
  code: string;
  defaultName: string;
  countryId: string;
};

export type CountryArrayDataType = {
  id: string;
  code: string;
  name: string;
  states: StateArrayDataType[];
};

export type ShippingMethodType = {
  cartId: string;
  shippingMethods: {
    carrier_code: string;
    method_code: string;
  }[];
};

export type PaymentMethodType = {
  cartId: string;
  paymentMethod: {
    code: string;
  };
};

export type PlacerOrderInputType = {
  cartId: string;
  transaction_id: number;
};

export type RegisterInputType = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type RecoverLoginType = {
  variables: { email: string };
  success: boolean;
  message: string;
};

export type ShippingAddressInputType = {
  cartId: string;
  input: {
    email: string;
    firstname: string;
    lastname: string;
    company: string;
    country_code: string;
    postcode: string;
    street: string[];
    city: string;
    telephone: string;
    region: { region: string; region_id: number };
  };
};

export type ShippingAddressType = {
  variables: ShippingAddressInputType;
};

export type ShippingMethodDataType = {
  variables: ShippingMethodType;
  success: boolean;
  setShippingMethodsOnCart: {};
};

export type PaymentMethodDataType = {
  variables: PaymentMethodType;
  success: boolean;
  setPaymentMethodsOnCart: {
    transaction_id: number;
  };
};

export type PlacerOrderDataType = {
  variables: PlacerOrderInputType;
  success: boolean;
  placeOrder: {
    order: {
      order_number: string;
    };
  };
};

export type RegisterDataType = {
  variables: RegisterInputType;
  success: boolean;
  message: string;
};
