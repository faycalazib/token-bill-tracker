import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import ModelSelector from '@/components/ModelSelector';
import { SpatialEmptyEstimate } from '@/components/spatial/ExperienceLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { getModelById } from '@/data/llmModels';
import { calculateTokenCosts, countTokensForModel, formatPrice, formatTokens } from '@/utils/tokenCalculator';
import { Upload, FileText, Zap } from 'lucide-react';
import { useTokenizerReady } from '@/hooks/useTokenizerReady';

interface BatchRow {
    input: string;
    output: string;
}

function parseData(raw: string): BatchRow[] {
    const lines = raw.trim().split('\n');
    if (lines.length === 0) return [];
    // Try JSON array
    try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr.map((value: unknown) => {
            const row = value && typeof value === 'object' ? value as Record<string, unknown> : {};
            return { input: typeof row.input === 'string' ? row.input : '', output: typeof row.output === 'string' ? row.output : '' };
        });
    } catch { /* Continue with CSV parsing. */ }
    // CSV: first line header, rest data
    const header = lines[0].toLowerCase();
    if (header.includes('input') && header.includes('output')) {
        const sep = header.includes('\t') ? '\t' : ',';
        const cols = header.split(sep).map(c => c.trim());
        const iIdx = cols.indexOf('input');
        const oIdx = cols.indexOf('output');
        return lines.slice(1).filter(l => l.trim()).map(line => {
            const parts = line.split(sep);
            return { input: parts[iIdx] || '', output: parts[oIdx] || '' };
        });
    }
    // Fallback: each line is input, no output
    return lines.filter(l => l.trim()).map(l => ({ input: l, output: '' }));
}

export default function BatchCalculatorPage() {
    const tokenizerReady = useTokenizerReady();
    const { t } = useLanguage();
    const [selectedModel, setSelectedModel] = useState('');
    const [rawData, setRawData] = useState('');
    const [rows, setRows] = useState<BatchRow[]>([]);
    const [calculated, setCalculated] = useState(false);

    const model = getModelById(selectedModel);

    const results = useMemo(() => {
        if (!model || rows.length === 0) return null;
        const items = rows.map(row => {
            const inputTokens = countTokensForModel(row.input, model, tokenizerReady);
            const outputTokens = countTokensForModel(row.output, model, tokenizerReady);
            const { totalCost } = calculateTokenCosts(inputTokens, outputTokens, model);
            return { input: row.input.slice(0, 50), inputTokens, outputTokens, cost: totalCost };
        });
        const totalCost = items.reduce((s, r) => s + r.cost, 0);
        const totalTokens = items.reduce((s, r) => s + r.inputTokens + r.outputTokens, 0);
        return { items, totalCost, totalTokens };
    }, [model, rows, tokenizerReady]);

    const handleCalculate = () => {
        const parsed = parseData(rawData);
        setRows(parsed);
        setCalculated(true);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setRawData(ev.target?.result as string || '');
        };
        reader.readAsText(file);
    };

    return (
        <div className="container mx-auto px-4 py-5 space-y-5">
            <div className="text-center space-y-2 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow animate-float">
                        <Upload className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold animated-gradient-text">{t('batch.title')}</h1>
                </div>
                <p className="text-sm text-muted-foreground">{t('batch.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card className="card-3d gradient-border animate-fade-in-up">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            {t('batch.upload')}
                        </CardTitle>
                        <CardDescription className="text-xs">{t('batch.format')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} filterType="text" />
                        <div>
                            <input
                                type="file" accept=".csv,.json,.txt"
                                onChange={handleFileUpload}
                                className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                            />
                        </div>
                        <Textarea
                            value={rawData}
                            onChange={e => setRawData(e.target.value)}
                            placeholder={`input,output\n"Hello, how are you?","I'm doing great!"\n"Explain quantum physics","Quantum physics is..."`}
                            className="min-h-40 text-xs font-mono resize-y"
                        />
                        <Button
                            onClick={handleCalculate}
                            disabled={!selectedModel || !rawData.trim()}
                            className="w-full h-9 text-sm"
                        >
                            <Zap className="h-3.5 w-3.5 mr-1.5" />
                            {t('batch.calculate')}
                        </Button>
                    </CardContent>
                </Card>

                {!(calculated && results) && <SpatialEmptyEstimate variant="batch" />}
                {calculated && results && (
                    <div className="space-y-4 animate-scale-in">
                        <Card className="gradient-border">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-primary">{results.items.length}</div>
                                        <div className="text-[10px] text-muted-foreground">Conversations</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-primary">{formatTokens(results.totalTokens)}</div>
                                        <div className="text-[10px] text-muted-foreground">{t('cost.tokens')}</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-400">{formatPrice(results.totalCost)}</div>
                                        <div className="text-[10px] text-muted-foreground">{t('batch.total')}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="gradient-border">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{t('batch.results')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 max-h-[400px] overflow-y-auto stagger-children">
                                    {results.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary/30 transition-colors">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-[10px] font-mono text-muted-foreground w-5">{i + 1}.</span>
                                                <span className="text-xs truncate max-w-[200px]">{item.input || '—'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="text-[10px]">
                                                    {formatTokens(item.inputTokens + item.outputTokens)} tok
                                                </Badge>
                                                <span className="font-mono text-xs font-semibold text-primary">
                                                    {formatPrice(item.cost)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
