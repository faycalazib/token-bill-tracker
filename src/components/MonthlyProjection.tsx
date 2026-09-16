import { useMemo, useState } from 'react';
import { BarChart3, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SELECTABLE_MODELS } from '@/data/llmModels';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice, formatTokens } from '@/utils/tokenCalculator';
import { calculateMonthlyScenarios } from '@/utils/pricingScenarios';
import PriceProvenance from '@/components/PriceProvenance';

const textModels = SELECTABLE_MODELS.filter(model => model.type === 'text');

export default function MonthlyProjection({ onSelectModel }: { onSelectModel: (id: string) => void }) {
  const { t } = useLanguage();
  const [requests, setRequests] = useState(10_000);
  const [inputTokens, setInputTokens] = useState(500);
  const [outputTokens, setOutputTokens] = useState(200);
  const [cacheHitPercent, setCacheHitPercent] = useState(50);
  const [focusedModel, setFocusedModel] = useState('');

  const rows = useMemo(() => textModels.map(model => ({
    model,
    costs: calculateMonthlyScenarios(model, requests, inputTokens, outputTokens, cacheHitPercent),
  })).filter(row => inputTokens + outputTokens <= row.model.maxTokens)
    .sort((a, b) => a.costs.standard - b.costs.standard),
  [requests, inputTokens, outputTokens, cacheHitPercent]);
  const selected = rows.find(row => row.model.id === focusedModel) ?? rows[0];

  return <Card className="card-3d gradient-border animate-fade-in-up">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4 text-primary" />{t('projection.title')}</CardTitle>
      <CardDescription className="text-xs">{t('projection.desc')}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([
          ['requests', requests, setRequests, t('projection.requests')],
          ['inputTokens', inputTokens, setInputTokens, t('projection.input')],
          ['outputTokens', outputTokens, setOutputTokens, t('projection.output')],
          ['cacheHit', cacheHitPercent, setCacheHitPercent, t('projection.cache')],
        ] as const).map(([id, value, setter, label]) => <div key={id} className="space-y-1">
          <Label htmlFor={id} className="text-xs">{label}</Label>
          <Input id={id} type="number" min="0" max={id === 'cacheHit' ? 100 : undefined} step="1" value={value}
            onChange={event => setter(Math.max(0, Math.min(id === 'cacheHit' ? 100 : 10_000_000, Number(event.target.value) || 0)))} className="h-9 text-sm" />
        </div>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('projection.cheapest')}</h3>
          {rows.length === 0 && <p className="rounded-lg border border-border/40 p-3 text-xs text-muted-foreground">{t('projection.noModels')}</p>}
          {rows.slice(0, 8).map(({ model, costs }) => <button key={model.id} type="button" onClick={() => setFocusedModel(model.id)}
            className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-start ${selected?.model.id === model.id ? 'border-primary/50 bg-primary/10' : 'border-border/40 bg-secondary/20 hover:border-primary/30'}`}>
            <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{model.name}</span><span className="block text-[10px] text-muted-foreground">{model.provider}</span></span>
            <span className="shrink-0 font-mono text-xs font-semibold">{formatPrice(costs.standard)}</span>
          </button>)}
        </div>
        {selected && <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="space-y-1">
            <Label htmlFor="projection-model" className="text-xs">{t('projection.model')}</Label>
            <select id="projection-model" value={selected.model.id} onChange={event => setFocusedModel(event.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground">
              {rows.map(({ model }) => <option key={model.id} value={model.id}>{model.name} · {model.provider}</option>)}
            </select>
          </div>
          <div><h3 className="text-sm font-semibold">{selected.model.name}</h3><p className="text-xs text-muted-foreground">{selected.model.provider} · {formatTokens(requests)} {t('projection.requestsShort')}</p></div>
          <div className="space-y-2">
            <div className="flex justify-between gap-2 text-sm"><span>{t('projection.standard')}</span><strong className="font-mono">{formatPrice(selected.costs.standard)}</strong></div>
            <div className="flex justify-between gap-2 text-sm"><span>{t('projection.cached')}</span><strong className="font-mono">{selected.costs.cached === null ? '—' : formatPrice(selected.costs.cached)}</strong></div>
            <div className="flex justify-between gap-2 text-sm"><span>{t('projection.batch')}</span><strong className="font-mono">{selected.costs.batch === null ? '—' : formatPrice(selected.costs.batch)}</strong></div>
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">{t('projection.note')}</p>
          <PriceProvenance model={selected.model} compact />
          <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline" onClick={() => onSelectModel(selected.model.id)}>
            {t('projection.choose')} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>}
      </div>
    </CardContent>
  </Card>;
}
