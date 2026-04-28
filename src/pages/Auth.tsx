import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Enter a valid email").max(255);
const passSchema = z.string().min(6, "Password must be at least 6 characters").max(72);

export default function Auth() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");

  if (user) return <Navigate to="/chat" replace />;

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const ev = emailSchema.safeParse(email); const pv = passSchema.safeParse(password);
    if (!ev.success) return toast.error(ev.error.issues[0].message);
    if (!pv.success) return toast.error(pv.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin, data: { display_name: name || email.split("@")[0] } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome! Check your email to confirm your account.");
    nav("/chat");
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    nav("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-calm p-4">
      <Card className="w-full max-w-md p-8 shadow-soft border-border/60">
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-hero shadow-glow mb-3">
            <Heart className="h-7 w-7 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-semibold">Welcome to Serene</h1>
          <p className="text-sm text-muted-foreground mt-1">Your private space for mental wellness</p>
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={signIn} className="space-y-4">
              <div><Label htmlFor="e1">Email</Label><Input id="e1" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
              <div><Label htmlFor="p1">Password</Label><Input id="p1" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "…" : "Sign in"}</Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-4">
              <div><Label htmlFor="n2">Name (optional)</Label><Input id="n2" value={name} onChange={e => setName(e.target.value)} maxLength={60} /></div>
              <div><Label htmlFor="e2">Email</Label><Input id="e2" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
              <div><Label htmlFor="p2">Password</Label><Input id="p2" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "…" : "Create account"}</Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}