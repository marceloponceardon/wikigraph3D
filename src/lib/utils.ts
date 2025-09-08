// src/lib/utils.ts

import type { MediaWikiResponse, Page, Node } from "@/types/wikipedia";

export function normalizePageToNode(page: Page): Node {
  return {
    id: page.pageid,
    name: page.title,
    thumbnail: page.thumbnail ?? null,
    content: {
      desktop: {
        page: page.fullurl ?? null,
        edit: page.editurl ?? null,
        canonical: page.canonicalurl ?? null,
      },
      mobile: {
        page:
          page.fullurl?.replace("en.wikipedia.org", "en.m.wikipedia.org") ??
          null,
        edit:
          page.editurl?.replace("en.wikipedia.org", "en.m.wikipedia.org") ??
          null,
      },
    },
    description: page.description ?? null,
    extract: page.extract ?? null,
  };
}

export function normalizeMediaWikiResponse(
  response: MediaWikiResponse,
): Node[] {
  if (!response.query?.pages) return [];

  return Object.values(response.query.pages).map(normalizePageToNode);
}
