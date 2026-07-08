import { getRouteApi } from "@tanstack/react-router";
import type { SiteContent } from "~/data/content";

const rootApi = getRouteApi("__root__");

/** Site content loaded by the root route (defaults + admin overrides). */
export function useContent(): SiteContent {
  return rootApi.useLoaderData() as SiteContent;
}
