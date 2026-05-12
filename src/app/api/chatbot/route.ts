import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const systemPrompts: Record<string, string> = {
  "/": "You are a friendly MD PawVita assistant on the homepage. Help users discover the store, featured products, and navigate the site.",
  "/shop": "You are a shopping assistant for MD PawVita. Help users find the right products — food, toys, accessories, or live animals.",
  "/cart": "You are a cart assistant. Help users review their cart and feel confident before checkout.",
  "/checkout": "You are a checkout assistant. Payment is Cash on Delivery only. Answer delivery or order questions.",
  "/about": "You are a brand assistant. Answer questions about MD PawVita — its story, mission, and values.",
  "/contact": "You are a support assistant. Help users with their queries.",
  "/appointments": "You are a grooming and vet appointment assistant.",
};

const fallbackPrompt = "You are a helpful MD PawVita assistant.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];
    const pathname = typeof body.pathname === "string" ? body.pathname : "/";
    const systemPrompt = systemPrompts[pathname] ?? fallbackPrompt;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "GROQ_API_KEY is not configured." }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    // Groq uses same format as OpenAI — NOT Gemini format
    const reply = data?.choices?.[0]?.message?.content?.trim() ?? "Sorry, I couldn't answer that.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json({ message: "Failed to generate chatbot reply." }, { status: 500 });
  }
}