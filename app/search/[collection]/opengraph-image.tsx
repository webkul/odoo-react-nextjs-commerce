import OpengraphImage from "components/opengraph-image";
import { getCollection } from "lib/odoo";

export default async function Image({
  params,
}: {
  params: { collection: string };
}) {
  const collection = await getCollection(params.collection);
  const title = collection?.name || collection?.title;

  return await OpengraphImage({ title });
}
