import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { productListType } from 'lib/odoo/types';
import { Suspense } from 'react';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: productListType }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.price_range?.minimum_price?.regular_price?.value}
            currencyCode={product.price_range?.minimum_price?.regular_price?.currency}
          />
        </div>
      </div>
      <Suspense fallback={null}>
        <VariantSelector options={product.configurable_options} variants={product.variants} />
      </Suspense>

      {product.description ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.description}
        />
      ) : null}

      <Suspense fallback={null}>
        <AddToCart variants={product.variants} availableForSale={product?.in_stock} />
      </Suspense>
    </>
  );
}
