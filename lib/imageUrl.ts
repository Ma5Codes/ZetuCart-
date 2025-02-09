import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

export function imageUrl(source: SanityImageSource) {
  if (!source || !source.asset?._ref) return null; // ✅ Ensure `null` for missing images
  return builder.image(source).auto("format").fit("max").url() || null; // ✅ Prevent empty strings
}
