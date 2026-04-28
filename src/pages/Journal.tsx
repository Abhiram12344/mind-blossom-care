import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function Journal() {
  const { user } = useAuth();
  const [title, setTitle] = useState(""); const [content, setContent] = useState("");
  const [entries, setEntries] = useState<any[]>([]); const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("journal_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setEntries(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const save = async () => {
    if (!user || !content.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("journal_entries").insert({ user_id: user.id, title: title || null, content: content.trim() });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved to your journal"); setTitle(""); setContent(""); load();
  };

  const remove = async (id: string) => {
    await supabase.from("journal_entries").delete().eq("id", id);
    load();
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <main className="container max-w-3xl py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Private Journal</h1>
          <p className="text-muted-foreground mt-1">Your thoughts, encrypted and yours alone.</p>
        </div>

        <Card className="p-6 shadow-soft border-border/60 space-y-3">
          <Input placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} />
          <Textarea placeholder="What's on your mind today?" value={content} onChange={e => setContent(e.target.value)}
            className="min-h-32" maxLength={5000} />
          <Button onClick={save} disabled={saving || !content.trim()}>{saving ? "Saving…" : "Save entry"}</Button>
        </Card>

        <div className="space-y-3">
          {entries.map(e => (
            <Card key={e.id} className="p-5 shadow-soft border-border/60">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  {e.title && <h3 className="font-semibold">{e.title}</h3>}
                  <p className="text-xs text-muted-foreground">{format(new Date(e.created_at), "PPP · p")}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{e.content}</p>
            </Card>
          ))}
          {entries.length === 0 && <p className="text-center text-muted-foreground py-12">No entries yet. Your first one is the hardest.</p>}
        </div>
      </main>
    </div>
  );
}