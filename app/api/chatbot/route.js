import { NextResponse } from "next/server";

const resolveBaseUrl = () => {
  const baseUrl = process.env.CHATBOT_API_URL || "http://127.0.0.1:8000";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

export async function POST(request) {
  try {
    const payload = await request.json();
    const baseUrl = resolveBaseUrl();

    const upstreamResponse = await fetch(`${baseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      return NextResponse.json(
        { error: "Chatbot upstream error", details: errorText },
        { status: 502 }
      );
    }

    const data = await upstreamResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Chatbot request failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
