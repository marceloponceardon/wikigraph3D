import { NextResponse } from "next/server";

export async function GET(req, {}) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");

    const url = `https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q=${title}&limit=10`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.WIKIMEDIA_ACCESS_TOKEN}`,
        "User-Agent": `${process.env.APP_NAME} (${process.env.CONTACT})`,
      },
    });
    console.log(res.status);
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      console.log("error: !res.ok");
      return NextResponse.json({
        error: `Error finding links for title=${title}`,
      });
    }

    return NextResponse.json({
      title: title,
    });
  } catch (err) {
    return NextResponse.json({ error: err });
    console.log(err);
  }
}
