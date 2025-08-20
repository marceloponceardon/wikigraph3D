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
			},
    });

		if (!res.ok) {
			console.log("error: !res.ok");
			return NextResponse.json({ title: "Error fetching article" });
		}

		const data = await res.json();
		const todayArticle = data.tfa?.title || "No article today";

		console.log(todayArticle);
		return NextResponse.json({ title: todayArticle });
	} catch (err) {
		console.log("error: " + err);
		return NextResponse.json({ title: "Error fetching article" });
		console.err(err);
	}
}
