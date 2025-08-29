import { NextResponse } from "next/server";

export async function GET(req, {}) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const limit = searchParams.get("limit") || "max"; // default limit is 10

    //     const url = `https://en.wikipedia.org/w/api.php?action=query&generator=links&titles=${title}&format=json&gpllimit=${limit}`;
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

    const nodes = Object.values(query.pages || {}).map((page) => ({
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
        code: err.cause.code,
      },
      { status: 500 },
    );
  }
}
