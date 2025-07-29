import { GridTileImage } from "components/grid/tile";
import type {
  OdooPermotionItems,
  OdooPromotionBannerType,
} from "lib/odoo/types";
import Link from "next/link";

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: OdooPermotionItems;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block w-full h-full aspect-square"
        href={`/search/${item?.urlKey}`}
      >
        <GridTileImage
          src={item?.url}
          fill
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item?.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item?.title as string,
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid({
  homeCollection,
}: {
  homeCollection?: OdooPromotionBannerType;
}) {
  if (
    !homeCollection?.items?.[0] ||
    !homeCollection?.items?.[1] ||
    !homeCollection?.items?.[2]
  )
    return null;

  return (
    <section className="mx-auto grid md:max-h-[716px] max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem
        size="full"
        item={homeCollection?.items[0]}
        priority={true}
      />
      <ThreeItemGridItem
        size="half"
        item={homeCollection?.items[1]}
        priority={true}
      />
      <ThreeItemGridItem size="half" item={homeCollection?.items[2]} />
    </section>
  );
}
