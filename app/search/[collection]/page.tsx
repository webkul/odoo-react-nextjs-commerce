import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, LIMIT, sorting } from 'lib/constants';
import { getCollection, getCollectionProducts } from 'lib/odoo';
import Pagination from 'components/pagination';

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.name || collection.meta_title,
    description:
      collection.description || collection.meta_description || `${collection.title} products`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, page } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const { products, total } = await getCollectionProducts({
    collection: params.collection,
    page: page ? page : '1',
    sortKey,
    reverse
  });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
          {total > LIMIT ? (
            <nav
              aria-label="Collection pagination"
              className="mb-2 mt-4 block items-center sm:flex"
            >
              <Pagination
                itemsPerPage={LIMIT}
                itemsTotal={total}
                currentPage={page ? parseInt(page) - 1 : 0}
              />
            </nav>
          ) : null}
        </>
      )}
    </section>
  );
}
