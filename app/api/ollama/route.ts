import { NextRequest, NextResponse } from "next/server";
import { getOllamaResponse } from "@/app/hooks/ollamaService"; // adjust path if needed

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    const result = await getOllamaResponse(messages, model);
    return NextResponse.json({ content: result });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
