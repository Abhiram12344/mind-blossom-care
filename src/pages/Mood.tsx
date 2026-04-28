import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { format } from "date-fns";

const MOODS = [
  { v: 1, e: "😢", l: "Awful" }, { v: 2, e: "😕", l: "Low" },
  { v: 3, e: "😐", l: "Okay" }, { v: 4, e: "🙂", l: "Good" }, { v: 5, e: "😊", l: "Great" },
];

const Slider = ({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) => (
  <div>
    <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}/5</span></div>
    <div className="flex gap-2">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`flex-1 h-10 rounded-xl border transition-smooth ${value >= n ? "bg-primary border-primary" : "bg-muted border-border"}`} />
      ))}
    </div>
  </div>
);

export default function Mood() {
  const { user } = useAuth();
  const [mood, setMood] = useState(3); const [stress, setStress] = useState(3); const [sleep, setSleep] = useState(3);
  const [notes, setNotes] = useState(""); const [logs, setLogs] = useState<any[]>([]); const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("mood_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: true }).limit(30);
    setLogs(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const save = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("mood_logs").insert({ user_id: user.id, mood, stress, sleep, notes: notes || null });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Mood logged 🌿"); setNotes(""); load();
  };

  const chartData = logs.map(l => ({ date: format(new Date(l.created_at), "MMM d"), Mood: l.mood, Stress: l.stress, Sleep: l.sleep }));

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <main className="container max-w-5xl py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Mood Tracker</h1>
          <p className="text-muted-foreground mt-1">Check in with yourself. Small daily logs reveal big patterns.</p>
        </div>

        <Card className="p-6 shadow-soft border-border/60 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">How do you feel right now?</p>
            <div className="flex justify-between gap-2">
              {MOODS.map(m => (
                <button key={m.v} onClick={() => setMood(m.v)}
                  className={`flex-1 flex flex-col items-center gap-1 rounded-2xl p-3 transition-smooth ${mood === m.v ? "bg-primary/10 ring-2 ring-primary scale-105" : "hover:bg-muted"}`}>
                  <span className="text-3xl">{m.e}</span><span className="text-xs text-muted-foreground">{m.l}</span>
                </button>
              ))}
            </div>
          </div>
          <Slider label="Stress level" value={stress} onChange={setStress} />
          <Slider label="Sleep quality" value={sleep} onChange={setSleep} />
          <Textarea placeholder="A few words about your day (optional)…" value={notes} onChange={e => setNotes(e.target.value)} maxLength={500} />
          <Button onClick={save} disabled={loading} className="w-full">{loading ? "Saving…" : "Log mood"}</Button>
        </Card>

        {chartData.length > 0 && (
          <Card className="p-6 shadow-soft border-border/60">
            <h2 className="font-semibold mb-4">Your wellness over time</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[1,5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="Mood" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Stress" stroke="hsl(var(--crisis))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Sleep" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}