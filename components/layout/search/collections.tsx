import { Suspense } from "react";
import { getCollections } from "lib/odoo";
import FilterList from "./filter";
import CollectionPlaceholder from "./collection-placeholder";

async function CollectionList() {
  const collections = await getCollections();

  return <FilterList list={collections} title="Collections" />;
}



export default function Collections() {
  return (
    <Suspense
      fallback={
     <CollectionPlaceholder/>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
