import { AlertTriangle, Phone } from "lucide-react";

export const CrisisBanner = () => (
  <div className="rounded-2xl border-2 border-crisis/40 bg-crisis/5 p-5 my-3">
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-crisis mt-0.5 shrink-0" />
      <div className="space-y-2 text-sm">
        <p className="font-semibold text-foreground">You're not alone. Help is available right now.</p>
        <div className="grid sm:grid-cols-2 gap-2">
          <a href="tel:988" className="flex items-center gap-2 rounded-lg bg-background p-2 hover:bg-muted transition-smooth">
            <Phone className="h-4 w-4 text-crisis" /><span><b>988</b> · US Crisis Lifeline</span>
          </a>
          <a href="tel:116123" className="flex items-center gap-2 rounded-lg bg-background p-2 hover:bg-muted transition-smooth">
            <Phone className="h-4 w-4 text-crisis" /><span><b>116 123</b> · Samaritans UK</span>
          </a>
          <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-background p-2 hover:bg-muted transition-smooth sm:col-span-2">
            <Phone className="h-4 w-4 text-crisis" /><span>Find a helpline in your country →</span>
          </a>
        </div>
        <p className="text-muted-foreground text-xs">If you're in immediate danger, please call your local emergency number.</p>
      </div>
    </div>
  </div>
);

const CRISIS_PATTERNS = [
  /\b(kill myself|end my life|suicid|want to die|don'?t want to (live|be here)|hurt myself|self[- ]harm|end it all)\b/i,
  /\b(no reason to live|better off dead|hopeless|can'?t go on)\b/i,
];
export const detectCrisis = (text: string) => CRISIS_PATTERNS.some(r => r.test(text));