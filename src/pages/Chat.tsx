import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CrisisBanner, detectCrisis } from "@/components/CrisisBanner";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "I've been feeling overwhelmed lately…",
  "Help me with a breathing exercise",
  "I had a hard day at work",
  "I can't sleep at night",
];

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("chat_messages").select("role, content").eq("user_id", user.id).order("created_at", { ascending: true }).limit(100)
      .then(({ data }) => { if (data) setMessages(data as Msg[]); });
  }, [user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || streaming || !user) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next); setInput(""); setStreaming(true);
    if (detectCrisis(text)) setCrisis(true);

    await supabase.from("chat_messages").insert({ user_id: user.id, role: "user", content: userMsg.content });

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: next }),
      });
      if (resp.status === 429) { toast.error("Too many requests. Please wait."); setStreaming(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted."); setStreaming(false); return; }
      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = ""; let assistant = ""; let done = false;
      setMessages(m => [...m, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let i: number;
        while ((i = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, i); buf = buf.slice(i + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              assistant += c;
              setMessages(m => m.map((mm, idx) => idx === m.length - 1 ? { ...mm, content: assistant } : mm));
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
      if (assistant) await supabase.from("chat_messages").insert({ user_id: user.id, role: "assistant", content: assistant });
    } catch (e) {
      console.error(e); toast.error("Something went wrong. Please try again.");
    } finally { setStreaming(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-soft">
      <Navbar />
      <main className="flex-1 container max-w-3xl py-6 flex flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-hero shadow-glow animate-breathe">
                <Heart className="h-10 w-10 text-primary-foreground" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold">Hello, I'm Serene</h1>
                <p className="text-muted-foreground mt-2">A safe space to share what's on your mind. How are you feeling today?</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                {STARTERS.map(s => (
                  <button key={s} onClick={() => send(s)} className="text-left rounded-2xl border border-border/60 bg-card p-4 text-sm hover:border-primary/40 hover:shadow-soft transition-smooth">
                    <Sparkles className="h-4 w-4 inline text-primary mr-2" />{s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {crisis && <CrisisBanner />}
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-3xl px-5 py-3 whitespace-pre-wrap leading-relaxed",
                m.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border/60 rounded-bl-md shadow-soft"
              )}>{m.content || <span className="opacity-50">…</span>}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={e => { e.preventDefault(); send(input); }} className="sticky bottom-4 flex gap-2 rounded-3xl border border-border/60 bg-card p-2 shadow-soft">
          <Textarea
            value={input} onChange={e => setInput(e.target.value)} placeholder="Share what's on your mind…"
            className="flex-1 min-h-[48px] max-h-32 resize-none border-0 bg-transparent focus-visible:ring-0 shadow-none"
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            maxLength={2000}
          />
          <Button type="submit" size="icon" disabled={streaming || !input.trim()} className="rounded-2xl h-12 w-12 shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </main>
    </div>
  );
}