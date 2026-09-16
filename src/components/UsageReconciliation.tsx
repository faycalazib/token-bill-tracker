import { useMemo, useState } from 'react';
import { FileUp, ReceiptText, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getModelById } from '@/data/llmModels';
import { useLanguage } from '@/contexts/LanguageContext';
import { getActualUsage, setActualUsage, type ActualUsageRow } from '@/utils/storage';
import { parseUsageImport } from '@/utils/usageImport';
import { calculateTokenCosts, formatPrice, formatTokens } from '@/utils/tokenCalculator';

export default function UsageReconciliation() {
  const { t } = useLanguage();
  const [raw, setRaw] = useState('');
  const [rows, setRows] = useState<ActualUsageRow[]>(getActualUsage);
  const [message, setMessage] = useState('');
  const results = useMemo(() => rows.map(row => {
    const model = getModelById(row.modelId);
    const estimated = model ? calculateTokenCosts(
      row.inputTokens / row.requestCount, row.outputTokens / row.requestCount, model, row.requestCount,
    ).totalCost : 0;
    return { ...row, name: model?.name ?? row.modelId, estimated, difference: row.actualCost - estimated };
  }), [rows]);
  const estimatedTotal = results.reduce((sum, row) => sum + row.estimated, 0);
  const actualTotal = results.reduce((sum, row) => sum + row.actualCost, 0);

  const importRows = () => {
    try {
      const parsed = parseUsageImport(raw);
      if (!parsed.rows.length) { setMessage(t('usage.noValid')); return; }
      setActualUsage(parsed.rows);
      setRows(parsed.rows);
      setMessage(`${parsed.rows.length} ${t('usage.imported')} · ${parsed.skipped} ${t('usage.skipped')}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : t('usage.invalid')); }
  };

  return <Card className="gradient-border">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base"><ReceiptText className="h-4 w-4 text-primary" />{t('usage.title')}</CardTitle>
      <CardDescription className="text-xs">{t('usage.desc')}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="break-all text-xs text-muted-foreground">{t('usage.format')}</p>
          <input type="file" accept=".csv,text/csv" aria-label={t('usage.file')} className="block max-w-full text-xs"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) file.text().then(setRaw).catch(() => setMessage(t('usage.invalid')));
            }} />
          <Textarea value={raw} onChange={event => setRaw(event.target.value)} className="min-h-28 font-mono text-xs"
            placeholder={'model_id,input_tokens,output_tokens,actual_cost,request_count,date\ngpt-5.6-luna,500,200,0.0005,1,2026-09-16'} />
          <Button size="sm" onClick={importRows} disabled={!raw.trim()}><FileUp className="mr-1.5 h-4 w-4" />{t('usage.import')}</Button>
          {message && <p role="status" className="text-xs text-muted-foreground">{message}</p>}
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-secondary/30 p-3 text-center"><strong className="block text-sm">{formatTokens(rows.length)}</strong><span className="text-[10px] text-muted-foreground">{t('usage.rows')}</span></div>
            <div className="rounded-lg bg-secondary/30 p-3 text-center"><strong className="block text-sm">{formatPrice(estimatedTotal)}</strong><span className="text-[10px] text-muted-foreground">{t('usage.estimated')}</span></div>
            <div className="rounded-lg bg-secondary/30 p-3 text-center"><strong className="block text-sm">{formatPrice(actualTotal)}</strong><span className="text-[10px] text-muted-foreground">{t('usage.actual')}</span></div>
          </div>
          {rows.length > 0 && <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
            <span>{t('usage.difference')}</span><strong className={actualTotal > estimatedTotal ? 'text-amber-500' : 'text-emerald-500'}>{actualTotal >= estimatedTotal ? '+' : '−'}{formatPrice(Math.abs(actualTotal - estimatedTotal))}</strong>
          </div>}
          <p className="text-[10px] leading-relaxed text-muted-foreground">{t('usage.note')}</p>
          {rows.length > 0 && <Button variant="outline" size="sm" onClick={() => { setRows([]); setActualUsage([]); setMessage(''); }}><Trash2 className="mr-1.5 h-3.5 w-3.5" />{t('usage.clear')}</Button>}
        </div>
      </div>
      {results.length > 0 && <div className="max-h-72 space-y-1 overflow-y-auto border-t border-border/40 pt-3">
        {results.map((row, index) => <div key={index} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-secondary/20 px-3 py-2 text-xs">
          <span className="min-w-0 font-medium">{row.name}<span className="ms-2 text-muted-foreground">{formatTokens(row.inputTokens)} in · {formatTokens(row.outputTokens)} out</span></span>
          <span className="font-mono">{formatPrice(row.estimated)} → {formatPrice(row.actualCost)} <span className={row.difference > 0 ? 'text-amber-500' : 'text-emerald-500'}>({row.difference >= 0 ? '+' : '−'}{formatPrice(Math.abs(row.difference))})</span></span>
        </div>)}
      </div>}
    </CardContent>
  </Card>;
}
