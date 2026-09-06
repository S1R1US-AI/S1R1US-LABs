import type { ImgHTMLAttributes } from "react";
import { seoImgAlt } from "@/lib/brand";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Human picture words. AI agents + bitcoin accumulation agent are appended. */
  desc?: string;
};

/** Every GIF/picture posted on the desk: alt + title carry AI agents / bitcoin accumulation agent. */
export function SeoImage({ desc, alt, title, ...rest }: Props) {
  const label = seoImgAlt(String(alt || desc || ""));
  return <img {...rest} alt={label} title={title ? seoImgAlt(String(title)) : label} itemProp="image" />;
}
