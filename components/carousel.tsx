import { isArray, isObject } from 'lib/type-guards';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { OdooFeatureProductType } from 'lib/odoo/types';

export async function Carousel({ homeCollection }: { homeCollection: OdooFeatureProductType }) {
  // Collections that start with `hidden-*` are hidden from the search page.

  if (!isObject(homeCollection)) return null;
  const carouselProducts = homeCollection?.productList;
  return (
    <div className="hiddenScrollBar px-px w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex w-full animate-carousel gap-4">
        {isArray(carouselProducts) &&
          carouselProducts.map((product) => {
            return (
              <li
                key={`${product?.id}`}
                className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
              >
                <Link href={`/product/${product?.url_key}`} className="relative h-full w-full">
                  <GridTileImage
                    alt={product?.thumbnail?.name}
                    label={{
                      title: product.name,
                      amount: product?.price_range?.minimum_price?.regular_price.value,
                      currencyCode: product?.price_range?.minimum_price?.regular_price.currency
                    }}
                    src={product?.thumbnail?.id}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  />
                </Link>
              </li>
            );
          })}
          
      </ul>
    </div>
  );
}
