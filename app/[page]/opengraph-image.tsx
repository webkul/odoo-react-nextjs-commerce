import OpengraphImage from "components/opengraph-image";
import { getPage } from "lib/odoo";

export default async function Image({ params }: { params: { page: string } }) {
  const page = await getPage({ identifier: params.page });
  const title = page.title || page.metaKeywords;

  return await OpengraphImage({ title });
}
