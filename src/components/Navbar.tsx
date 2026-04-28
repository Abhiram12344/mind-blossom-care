import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, BarChart3, BookOpen, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/mood", label: "Mood", icon: BarChart3 },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/care", label: "Self-Care", icon: Sparkles },
];

export const Navbar = () => {
  const { user } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  const signOut = async () => { await supabase.auth.signOut(); nav("/"); };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-hero shadow-glow">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Serene</span>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => {
              const active = loc.pathname === l.to;
              return (
                <Link key={l.to} to={l.to} className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-smooth",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                )}>
                  <l.icon className="h-4 w-4" />{l.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />Sign out
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/auth">Sign in</Link></Button>
              <Button size="sm" asChild><Link to="/auth">Get started</Link></Button>
            </>
          )}
        </div>
      </div>
      {user && (
        <nav className="md:hidden flex items-center justify-around border-t border-border/60 py-2">
          {links.map(l => {
            const active = loc.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs",
                active ? "text-primary" : "text-muted-foreground"
              )}>
                <l.icon className="h-5 w-5" />{l.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};