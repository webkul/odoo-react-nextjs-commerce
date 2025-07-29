import clsx from "clsx";

export default function CollectionPlaceholder() {
  const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded-sm";
  const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
  const items = "bg-neutral-400 dark:bg-neutral-700";

  return (
    <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
      <div className={clsx(skeleton, activeAndTitles)} />
      <div className={clsx(skeleton, activeAndTitles)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
    </div>
  );
}
