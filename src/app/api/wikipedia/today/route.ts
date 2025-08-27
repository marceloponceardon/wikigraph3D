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
      return NextResponse.json(
        { error: "Error fetching article" },
        { status: 500 },
      );
    }

    const data = await res.json();
    const title = data.tfa?.title || "No title";
    const id = data.tfa?.pageid || "No pageid";
    const display = data.tfa?.displaytitle || "No display title";
    const thumbnail = data.tfa?.thumbnail || "No thumbnail found";
    const page_url = data.tfa?.content_urls?.desktop.page || "No url found";
    const content_urls = data.tfa?.content_urls || "No urls found";
    const description = data.tfa?.description || "No description found";
    const extract = data.tfa?.extract_html || "No extract found";

    console.log(data);

    return NextResponse.json({
      id: id,
      title: title,
      display: display,
      thumbnail: thumbnail,
      page_url: page_url,
      content_urls: content_urls,
      description: description,
      extract: extract,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
