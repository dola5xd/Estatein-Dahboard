import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const getSanityClient = (token?: string | null) =>
  createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: !token,
    token: token || undefined,
  });

const builder = imageUrlBuilder(getSanityClient());

export const urlFor = (source: { asset: { _ref: string } }) =>
  builder.image(source);
