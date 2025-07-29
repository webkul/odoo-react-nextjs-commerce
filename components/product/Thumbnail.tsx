"use client";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { ImageLoader } from "next/dist/client/image-component";
import { OnLoadingComplete, PlaceholderValue, StaticImport } from "next/dist/shared/lib/get-img-props";

type ThumbnailProps = {
    src: string | StaticImport;
    alt: string;
    width?: number | `${number}`;
    height?: number | `${number}`;
    fill?: boolean;
    loader?: ImageLoader;
    quality?: number | `${number}`;
    priority?: boolean;
    loading?: "eager" | "lazy" | undefined;
    placeholder?: PlaceholderValue;
    blurDataURL?: string;
    unoptimized?: boolean;
    overrideSrc?: string;
    onLoadingComplete?: OnLoadingComplete;
    layout?: string;
    objectFit?: string;
    objectPosition?: string;
    lazyBoundary?: string;
    lazyRoot?: string;
    sizes?: string;
    decoding?: "sync" | "async" | "auto";
    className?: string;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
};

export const Thumbnail: FC<ThumbnailProps> = ({
  src: thumbnail,
  priority = false,
  height,
  sizes,
  width,
  decoding = "auto",
  loading = "lazy",
  fill = false,
  alt,
  placeholder = "blur",
  className = "",
  onClick,
}) => {
  const [src, setSrc] = useState<string|StaticImport>("/icons/placeholder.png");

  /**
   * Settings SRC after receiving it from the server
   */
  useEffect(() => {
    if (thumbnail) {
      setSrc(thumbnail);
    }
  }, [thumbnail]);

  return (
    <>
      <Image
        sizes={sizes}
        onClick={onClick}
        className={className}
        src={src}
        fill={fill}
        decoding={decoding}
        loading={!priority ? loading : undefined}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL="/icons/placeholder.png"
        alt={alt}
        onError={() => setSrc("/icons/placeholder.png")}
      />
    </>
  );
};
export default Thumbnail;
