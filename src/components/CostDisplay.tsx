import { TokenCalculation } from '@/types/llm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice, formatTokens } from '@/utils/tokenCalculator';
import { DollarSign, Hash, ArrowDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface CostDisplayProps {
  calculation: TokenCalculation;
  className?: string;
}

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 6 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const duration = 600;
    const start = performance.now();
    const startVal = display;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(startVal + (value - startVal) * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value]);

  return <span>{prefix}{display.toFixed(decimals)}{suffix}</span>;
}

export default function CostDisplay({ calculation, className }: CostDisplayProps) {
  const { inputTokens, outputTokens, totalTokens, inputCost, outputCost, requestCost = 0, totalCost } = calculation;

  const costLevel = totalCost < 0.001 ? 'text-green-400' : totalCost < 0.01 ? 'text-yellow-400' : 'text-red-400';

  return (
    <Card className={`card-3d gradient-border animate-scale-in ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 animate-glow-pulse">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          Analyse des Coûts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token counts */}
        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Hash className="h-3 w-3" />
            Tokens
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-secondary/50 p-2.5 text-center hover-glow">
              <div className="text-base font-bold text-primary">{formatTokens(inputTokens)}</div>
              <div className="text-[10px] text-muted-foreground">Input</div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-2.5 text-center hover-glow">
              <div className="text-base font-bold text-primary">{formatTokens(outputTokens)}</div>
              <div className="text-[10px] text-muted-foreground">Output</div>
            </div>
            <div className="rounded-lg bg-primary/10 p-2.5 text-center hover-glow gradient-border">
              <div className="text-base font-bold text-primary">{formatTokens(totalTokens)}</div>
              <div className="text-[10px] text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coûts</h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2 transition-colors hover:bg-secondary/50">
              <span className="text-xs text-muted-foreground">Input</span>
              <span className="font-mono text-sm font-medium">{formatPrice(inputCost)}</span>
            </div>
            <div className="flex justify-center">
              <ArrowDown className="h-3 w-3 text-muted-foreground/50" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2 transition-colors hover:bg-secondary/50">
              <span className="text-xs text-muted-foreground">Output</span>
              <span className="font-mono text-sm font-medium">{formatPrice(outputCost)}</span>
            </div>
            {requestCost > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2 transition-colors hover:bg-secondary/50">
                <span className="text-xs text-muted-foreground">Frais de requête</span>
                <span className="font-mono text-sm font-medium">{formatPrice(requestCost)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total cost — big number */}
        <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 border border-primary/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Coût Total</span>
            <span className={`text-2xl font-bold font-mono ${costLevel} transition-colors duration-500`}>
              <AnimatedNumber value={totalCost} prefix="$" />
            </span>
          </div>
          {totalCost > 0 && (
            <div className="mt-1.5 text-xs text-muted-foreground">
              ≈ {formatPrice((totalCost / totalTokens) * 1000)} / 1K tokens
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
