import { NextResponse } from "next/server";

export async function GET(req, {}) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const limit = searchParams.get("limit") || "max"; // default limit is 10

    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=links&titles=${title}&format=json&gpllimit=${limit}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.WIKIMEDIA_ACCESS_TOKEN}`,
        "User-Agent": `${process.env.APP_NAME} (${process.env.CONTACT})`,
      },
    });
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      console.error("res!.ok");
      return NextResponse.json(
        { error: `Error finding links for title=${title}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      continue: data.continue,
      links: data.query.pages,
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
