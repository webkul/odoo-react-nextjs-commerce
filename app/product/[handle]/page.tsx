import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Footer from 'components/layout/footer';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { getProduct } from 'lib/odoo';
import { Image } from 'lib/odoo/types';
import { Suspense } from 'react';
import { isObject } from 'lib/type-guards';
import Navbar from 'components/layout/navbar';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const { products } = await getProduct(params.handle);

  if (!isObject(products?.[0])) return notFound();
  const product = products?.[0];
  const { name, label: alt } = product.thumbnail || {};
  // const indexable = !product?.tags?.includes(HIDDEN_PRODUCT_TAG);
  const url = name;
  const width = 100;
  const height = 100;

  return {
    title: product.name || product.sku,
    description: product.description || product.short_description,
    // robots: {
    //   index: indexable,
    //   follow: indexable,
    //   googleBot: {
    //     index: indexable,
    //     follow: indexable
    //   }
    // },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const { products } = await getProduct(params.handle);

  if (!isObject(products?.[0])) return notFound();
  const product = products?.[0];
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.thumbnail.name,
    offers: {
      '@type': 'AggregateOffer',
      availability: product?.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.price_range?.minimum_price?.regular_price?.currency,
      highPrice: product.price_range?.maximum_price?.regular_price?.value,
      lowPrice: product?.price_range?.minimum_price?.regular_price?.value
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <Navbar />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.images.map((image: Image) => ({
                  src: image.name,
                  altText: image.name
                }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} />
          </div>
        </div>
        {/* <RelatedProducts id={product.id} /> */}
      </div>
      <Footer />
    </>
  );
}
//Todo: Relative product api is no getting
// async function RelatedProducts({ id }: { id: string }) {
//   const relatedProducts = await getProductRecommendations(id);

//   if (!relatedProducts.length) return null;

//   return (
//     <div className="py-8">
//       <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
//       <ul className="flex w-full gap-4 overflow-x-auto pt-1">
//         {relatedProducts.map((product) => (
//           <li
//             key={product.url_key}
//             className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
//           >
//             <Link className="relative h-full w-full" href={`/product/${product.url_key}`}>
//               <GridTileImage
//                 alt={product.name}
//                 label={{
//                   title: product.name,
//                   amount: product.priceRange.maxVariantPrice.amount,
//                   currencyCode: product.priceRange.maxVariantPrice.currencyCode
//                 }}
//                 src={product.featuredImage?.url}
//                 fill
//                 sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
//               />
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
