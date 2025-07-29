import type { Metadata } from "next";

import Prose from "components/prose";
import { getPage } from "lib/odoo";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage({
    identifier: params.page,
  });

  if (!page) return notFound();

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    openGraph: {
      publishedTime: page?.createdAt,
      modifiedTime: page?.updatedAt,
      type: "article",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const params = await props.params;
  const page = await getPage({
    identifier: params.page,
  });

  if (!page) return notFound();

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      <Prose className="mb-8" html={page.content as string} />
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        ).format(new Date())}.`}
      </p>
    </>
  );
}
