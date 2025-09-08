import { NextResponse } from "next/server";
import { TFA_API_BASE } from "@/lib/constants";
import { normalizePageToNode } from "@/lib/utils";

export async function GET() {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const url = `${TFA_API_BASE}/en/featured/${year}/${month}/${day}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.WIKIMEDIA_ACCESS_TOKEN}`,
        "User-Agent": `${process.env.APP_NAME} (${process.env.CONTACT})`,
      },
    });

    if (!res.ok) {
      console.error("error: !res.ok");
      return NextResponse.json(
        { error: "Error fetching article" },
        { status: 500 },
      );
    }

    const data = await res.json();

    const node = normalizePageToNode(data.tfa);
    node.content = data.tfa?.content_urls; // Since normalizePageToNode doesn't work 100% with this type of response

    console.log(node);

    return NextResponse.json({ node });
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
