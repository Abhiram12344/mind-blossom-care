import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Sparkles, Quote, BookOpen } from "lucide-react";

const AFFIRMATIONS = [
  "I am doing the best I can with what I have today.",
  "My feelings are valid, and they will pass.",
  "I deserve compassion — especially from myself.",
  "Small steps forward are still progress.",
  "I am safe in this moment.",
];

const PROMPTS = [
  "What's one small thing that brought me peace today?",
  "What would I tell a friend going through what I'm feeling?",
  "What am I holding onto that I could gently release?",
  "Describe a place where you feel completely safe.",
];

function Breathing() {
  const [active, setActive] = useState(false);
  return (
    <Card className="p-8 shadow-soft border-border/60 text-center space-y-6">
      <div className="flex items-center justify-center gap-2"><Wind className="h-5 w-5 text-primary" /><h2 className="font-semibold">Box Breathing</h2></div>
      <div className="relative h-48 flex items-center justify-center">
        <div className={`h-32 w-32 rounded-full bg-gradient-hero shadow-glow ${active ? "animate-breathe" : ""}`} />
        <span className="absolute text-primary-foreground font-medium text-sm pointer-events-none">{active ? "Breathe" : "Ready"}</span>
      </div>
      <p className="text-sm text-muted-foreground">Inhale 4s · Hold 4s · Exhale 4s · Hold 4s</p>
      <Button onClick={() => setActive(a => !a)} variant={active ? "secondary" : "default"}>{active ? "Stop" : "Begin"}</Button>
    </Card>
  );
}

function Affirmation() {
  const [i, setI] = useState(0);
  return (
    <Card className="p-8 shadow-soft border-border/60 space-y-4 bg-gradient-calm">
      <div className="flex items-center gap-2"><Quote className="h-5 w-5 text-primary" /><h2 className="font-semibold">Affirmation</h2></div>
      <p className="text-xl font-medium leading-relaxed">"{AFFIRMATIONS[i]}"</p>
      <Button variant="outline" onClick={() => setI((i + 1) % AFFIRMATIONS.length)}>Next affirmation</Button>
    </Card>
  );
}

export default function SelfCare() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navbar />
      <main className="container max-w-5xl py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Self-Care Toolkit</h1>
          <p className="text-muted-foreground mt-1">Gentle practices for whenever you need them.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Breathing />
          <Affirmation />
        </div>
        <Card className="p-6 shadow-soft border-border/60">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="h-5 w-5 text-primary" /><h2 className="font-semibold">Journaling Prompts</h2></div>
          <ul className="space-y-2">
            {PROMPTS.map(p => (
              <li key={p} className="flex gap-3 rounded-xl p-3 hover:bg-muted transition-smooth">
                <Sparkles className="h-4 w-4 text-primary mt-1 shrink-0" /><span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </Card>
      </main>
    </div>
  );
}