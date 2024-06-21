import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { productListType } from 'lib/odoo/types';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: productListType[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.url_key} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product?.url_key}`}
          >
            <GridTileImage
              alt={product.name}
              label={{
                title: product.name,
                amount: product.price_range?.minimum_price?.regular_price?.value,
                currencyCode: product.price_range?.minimum_price?.regular_price?.currency
              }}
              src={product?.thumbnail?.name}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
