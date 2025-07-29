import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import Pagination from "components/pagination";
import { defaultSort, LIMIT, sorting } from "lib/constants";
import { getProducts } from "lib/odoo";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const {
    sort,
    q: searchValue,
    page,
  } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const { products, total } = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
    page,
  });
  const resultsText = products?.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products?.length === 0
            ? "There are no products that match "
            : `Showing ${products?.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products?.length > 0 ? (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
          {total > LIMIT ? (
            <nav
              aria-label="Collection pagination"
              className="items-center block mt-4 mb-2 sm:flex"
            >
              <Pagination
                itemsPerPage={LIMIT}
                itemsTotal={total}
                currentPage={page ? parseInt(page) - 1 : 0}
              />
            </nav>
          ) : null}
        </>
      ) : null}
    </>
  );
}
