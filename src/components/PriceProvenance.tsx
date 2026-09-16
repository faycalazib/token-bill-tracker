import { ExternalLink } from 'lucide-react';
import type { LLMModel } from '@/types/llm';
import { useLanguage } from '@/contexts/LanguageContext';

const staleDays = 30;

export default function PriceProvenance({ model, compact = false }: { model: LLMModel; compact?: boolean }) {
  const { t, language } = useLanguage();
  const date = model.verifiedAt ? new Date(`${model.verifiedAt}T00:00:00Z`) : null;
  const valid = date && !Number.isNaN(date.getTime());
  const age = valid ? (Date.now() - date.getTime()) / 86_400_000 : Infinity;
  const stale = age > staleDays;
  return <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${compact ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
    <span className={stale ? 'text-amber-500' : 'text-emerald-500'}>
      {valid ? `${stale ? t('prices.stale') : t('prices.verified')} ${date.toLocaleDateString(language)}` : t('prices.unverified')}
    </span>
    {model.sourceUrl && <a href={model.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
      {t('prices.source')} <ExternalLink className="h-3 w-3" />
    </a>}
    {!compact && model.pricingNote && <span className="basis-full">{model.pricingNote}</span>}
  </div>;
}
