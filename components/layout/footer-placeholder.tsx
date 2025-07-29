import React from "react";

export default function FooterMenuPlaceholder() {
  const skeleton = "w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700";
  return (
    <div className="flex h-[188px] w-[200px] flex-col gap-2">
      <div className={skeleton} />
      <div className={skeleton} />
      <div className={skeleton} />
      <div className={skeleton} />
      <div className={skeleton} />
      <div className={skeleton} />
    </div>
  );
}
