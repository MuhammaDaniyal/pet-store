"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, ChevronRight, Loader2, MessageSquareText, X } from "lucide-react";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const systemPrompts: Record<string, string> = {
  "/": "You are a friendly pet store assistant on the homepage. Help users discover the store, featured products, and navigate the site.",
  "/shop": "You are a shopping assistant for a pet store. Help users find the right products — food, toys, accessories, or live animals. Answer questions about filters, categories, and product details.",
  "/cart": "You are a cart assistant. Help users review their cart, understand pricing, and feel confident before proceeding to checkout.",
  "/checkout": "You are a checkout assistant. Help users fill in their delivery details. Payment is Cash on Delivery only. Answer any delivery or order questions.",
  "/about": "You are a brand assistant. Answer questions about the pet store — its story, mission, and values.",
  "/contact": "You are a support assistant. Help users with their queries and guide them on how to reach the team.",
  "/appointments": "You are a grooming and vet appointment assistant. Help users understand how to book appointments, what services are available, and what to expect.",
};

const fallbackPrompt = "You are a helpful pet store assistant. Answer any questions the user has.";

export default function SiderChatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi, I’m your Pet Assistant. Ask me anything about the store, products, cart, or checkout.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const systemPrompt = useMemo(() => {
    return systemPrompts[pathname] ?? fallbackPrompt;
  }, [pathname]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          pathname,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chatbot response");
      }

      const data: { reply?: string } = await response.json();
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply || "Sorry, I couldn’t answer that just now." },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "Sorry, something went wrong while contacting the assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_18px_40px_rgba(255,107,53,0.28)] transition-transform hover:scale-105"
        aria-label="Open chatbot"
      >
        <MessageSquareText className="h-6 w-6" />
      </button>

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform border-l border-border bg-surface shadow-[0_30px_80px_rgba(26,83,92,0.18)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted">Assistant</p>
              <h2 className="mt-1 text-lg font-semibold text-primary">🐾 Pet Assistant</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-border bg-background p-2 text-primary transition-colors hover:bg-accent/10"
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="border-b border-border bg-background/60 px-5 py-3 text-xs text-secondary">
            Context-aware help for {pathname === "/" ? "the homepage" : pathname}.
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-accent text-white"
                      : "border border-border bg-background text-primary"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-secondary shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  <span>Thinking</span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" />
                  </span>
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-3 rounded-2xl border border-border bg-background px-4 py-3 text-xs text-secondary">
              {systemPrompt}
            </div>

            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                rows={2}
                placeholder="Ask about products, checkout, or anything else..."
                className="min-h-[52px] flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-primary outline-none transition-colors placeholder:text-muted focus:border-accent"
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={loading || !input.trim()}
                className="inline-flex h-[52px] items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Close chatbot overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-black/20"
        />
      ) : null}
    </>
  );
}
