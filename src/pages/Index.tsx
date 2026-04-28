import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, BarChart3, BookOpen, Sparkles, Shield, Lock } from "lucide-react";
import heroImg from "@/assets/hero-calm.jpg";
import { useAuth } from "@/hooks/useAuth";

const features = [
  { icon: MessageCircle, title: "AI Wellness Chat", desc: "A compassionate companion that listens, understands emotions, and offers gentle guidance — anytime, day or night." },
  { icon: BarChart3, title: "Mood Tracking", desc: "Daily check-ins with beautiful charts that reveal your patterns and progress over time." },
  { icon: BookOpen, title: "Private Journal", desc: "A secure, encrypted space to capture your thoughts. Yours, and yours alone." },
  { icon: Sparkles, title: "Self-Care Tools", desc: "Guided breathing, affirmations, and journaling prompts whenever you need a moment." },
  { icon: Shield, title: "Crisis Support", desc: "If things feel unbearable, instant access to verified helplines and emergency resources." },
  { icon: Lock, title: "Private by Design", desc: "End-to-end protected. Your conversations and data are never shared." },
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" width={1536} height={1024} className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        <div className="container max-w-4xl py-24 md:py-32 text-center space-y-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-hero shadow-glow animate-breathe mx-auto">
            <Heart className="h-8 w-8 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
            A calmer mind,<br /><span className="text-primary">one breath at a time.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Serene is your private AI mental wellness companion. Talk through what's weighing on you, track your moods, and discover gentle tools to feel more grounded — wherever you are.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild className="rounded-full px-8">
              <Link to={user ? "/chat" : "/auth"}>{user ? "Open Serene" : "Start your journey"}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8">
              <Link to="/care">Explore self-care</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Free · Private · Available 24/7</p>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold">Everything you need to feel a little better</h2>
          <p className="text-muted-foreground mt-3">Thoughtfully designed tools that meet you where you are.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <Card key={f.title} className="p-6 shadow-soft border-border/60 hover:border-primary/40 transition-smooth">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container max-w-3xl py-20 text-center">
        <Card className="p-10 md:p-14 bg-gradient-calm border-0 shadow-soft">
          <h2 className="text-3xl font-semibold mb-3">Begin when you're ready</h2>
          <p className="text-muted-foreground mb-6">Take the first gentle step toward a more peaceful mind.</p>
          <Button size="lg" asChild className="rounded-full px-8">
            <Link to={user ? "/chat" : "/auth"}>{user ? "Talk to Serene" : "Create free account"}</Link>
          </Button>
        </Card>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        Serene is not a substitute for professional medical care. In a crisis, please call your local emergency number.
      </footer>
    </div>
  );
}
