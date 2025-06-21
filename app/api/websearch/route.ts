import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("✅ Received body in API:", body);

    if (
      !body.query ||
      typeof body.query !== "string" ||
      body.query.trim() === ""
    ) {
      console.warn("⚠️ Query validation failed:", body.query);
      return NextResponse.json(
        { error: "Missing or empty query" },
        { status: 422 }
      );
    }

    const query = body.query.trim();

    const braveRes = await axios.get(
      "https://api.search.brave.com/res/v1/web/search",
      {
        headers: {
          "X-Subscription-Token": "BSA7JjSYYvT9InsNVJzNwCK4MGY9eLq",
          Accept: "application/json",
        },
        params: {
          q: query,
          count: 5,
        },
      }
    );

    console.log("📡 Brave raw response:", braveRes.data);

    type WebResult = {
      title: string;
      url: string;
      snippet: string;
    };

    const results = (braveRes.data.web?.results ?? []).map((r: WebResult) => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet,
    }));

    return NextResponse.json({ results });
  } catch (error: unknown) {
    let message = "Failed to perform web search";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          "🚨 Brave API responded with error:",
          error.response.data
        );
        message = `Brave API error: ${JSON.stringify(error.response.data)}`;
      } else {
        console.error("🚨 Axios error (no response):", error.message);
        message = error.message;
      }
    } else if (error instanceof Error) {
      console.error("🔥 Unexpected error:", error.message);
      message = error.message;
    } else {
      console.error("🔥 Unknown error:", error);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
