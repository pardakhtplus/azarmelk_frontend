import Image, { type ImageProps } from "next/image";

const ARVAN_HOSTNAMES = [
  "arvanstorage.ir",
  "storage.arvancloud.ir",
  process.env.NEXT_PUBLIC_BUCKET_URL || "",
];

export function isArvanHost(url: string) {
  try {
    const u = new URL(url);
    return ARVAN_HOSTNAMES.some((h) => u.hostname.includes(h));
  } catch {
    return false;
  }
}

export default function CustomImage(props: ImageProps) {
  const { src, alt, width = 100, height = 100, quality = 75, ...rest } = props;

  const srcStr = (src || "") as string;

  // if (isArvanHost(srcStr)) {
  //   const delim = srcStr.includes("?") ? "&" : "?";
  //   srcStr = `${srcStr}${delim}w=${width}&q=${quality}`;
  // }

  return (
    <Image
      unoptimized={isArvanHost(srcStr)}
      src={srcStr}
      alt={alt || ""}
      width={width}
      height={height}
      quality={quality}
      {...rest}
    />
  );
}
