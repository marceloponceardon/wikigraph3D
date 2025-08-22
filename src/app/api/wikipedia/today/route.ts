import { NextResponse } from "next/server";

export async function GET() {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.WIKIMEDIA_ACCESS_TOKEN}`,
        "User-Agent": `${process.env.APP_NAME} (${process.env.CONTACT})`,
      },
    });

    if (!res.ok) {
      console.log("error: !res.ok");
      return NextResponse.json({ title: "Error fetching article" });
    }

    const data = await res.json();
    const title = data.tfa?.displaytitle || "No article today";
    const thumbnail = data.tfa?.thumbnail || "No thumbnail found";
    const content_urls = data.tfa?.content_urls || "No urls found";
    const description = data.tfa?.description || "No description found";
    const extract = data.tfa?.extract_html || "No extract found";

    return NextResponse.json({
      title: title,
      thumbnail: thumbnail,
      content_urls: content_urls,
      description: description,
      extract: extract,
    });
  } catch (err) {
    console.log("error: " + err);
    return NextResponse.json({ title: "Error fetching article" });
    console.err(err);
  }
}
