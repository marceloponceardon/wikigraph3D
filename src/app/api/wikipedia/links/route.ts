import { NextResponse } from "next/server";

function normalizePageToNode(page) {
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

// You can keep this in the same file or a separate helper
async function fetchAllPages(title: string, limit = "50") {
  const allPages: [] = [];
  let continueParams: Record<string, string> = {};

  do {
    const url = new URL("https://en.wikipedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("generator", "links");
    url.searchParams.set("titles", title);
    url.searchParams.set("format", "json");
    url.searchParams.set("gpllimit", limit); // limit number of links
    url.searchParams.set("gplnamespace", "0"); // only main/article namespace
    url.searchParams.set("prop", "pageimages|info|description|extracts");
    url.searchParams.set("inprop", "url");
    url.searchParams.set("piprop", "thumbnail");
    url.searchParams.set("pithumbsize", "200");
    url.searchParams.set("exintro", "true");

    // Add continuation params if present
    for (const key in continueParams) {
      url.searchParams.set(key, continueParams[key]);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.WIKIMEDIA_ACCESS_TOKEN}`,
        "User-Agent": `${process.env.APP_NAME} (${process.env.CONTACT})`,
      },
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Error fetching links for title=${title}`);
    }

    allPages.push(...Object.values(data.query?.pages || {}));

    continueParams = data.continue || {}; // update continuation tokens
  } while (Object.keys(continueParams).length > 0);

  return allPages;
}

//export async function GET(req: Request) {
//  try {
//    const { searchParams } = new URL(req.url);
//    const title = searchParams.get("title");
//    const limit = searchParams.get("limit") || "max";
//
//    const pages = await fetchAllPages(title, limit);
//
//    // Convert pages to nodes using the separate helper
//    const nodes = pages.map(normalizePageToNode);
//
//    return NextResponse.json({ nodes });
//  } catch (err) {
//    console.error(err);
//    return NextResponse.json(
//      { error: "Internal Server Error", code: err?.cause?.code },
//      { status: 500 }
//    );
//  }
//}
//
//

export async function GET(req, {}) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const limit = searchParams.get("limit") || "max"; // default limit is the max

    const url = `https://en.wikipedia.org/w/api.php
		  ?action=query
		  &generator=links
		  &titles=${encodeURIComponent(title)}
		  &format=json
		  &gpllimit=${limit}
		  &prop=pageimages|info|description|extracts
		  &inprop=url
		  &piprop=thumbnail
		  &pithumbsize=200
		  &exintro=true
		  &explaintext=false`.replace(/\s+/g, "");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.WIKIMEDIA_ACCESS_TOKEN}`,
        "User-Agent": `${process.env.APP_NAME} (${process.env.CONTACT})`,
      },
    });
    const responseJson = await res.json();
    const continue_ = responseJson.continue;
    const query = responseJson.query;
    const batchComplete = responseJson.batchcomplete;

    if (!res.ok) {
      console.error("res!.ok");
      return NextResponse.json(
        { error: `Error finding links for title=${title}` },
        { status: 500 },
      );
    }

    const nodes = Object.values(query?.pages || {}).map((page) => ({
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
    }));

    return NextResponse.json({
      batchcomplete: batchComplete,
      continue: continue_,
      nodes,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        code: `${err}`,
      },
      { status: 500 },
    );
  }
}
