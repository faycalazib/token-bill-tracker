import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getHistory, clearHistory, deleteHistoryEntry, HistoryEntry } from '@/utils/storage';
import { formatPrice, formatTokens } from '@/utils/tokenCalculator';
import { Clock, Trash2, Download } from 'lucide-react';
import UsageReconciliation from '@/components/UsageReconciliation';

function exportCSV(entries: HistoryEntry[]) {
    const header = 'Date,Modèle,Provider,Input Tokens,Output Tokens,Coût Total\n';
    const rows = entries.map(e =>
        `${e.timestamp},${e.modelName},${e.provider},${e.inputTokens},${e.outputTokens},${e.totalCost.toFixed(6)}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `llm-costs-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function HistoryPage() {
    const { t } = useLanguage();
    const [history, setHistory] = useState<HistoryEntry[]>(getHistory);
    const [confirmClear, setConfirmClear] = useState(false);

    const totalCost = useMemo(() => history.reduce((s, e) => s + e.totalCost, 0), [history]);

    const handleDelete = (id: string) => {
        deleteHistoryEntry(id);
        setHistory(getHistory());
    };

    const handleClear = () => {
        if (confirmClear) {
            clearHistory();
            setHistory([]);
            setConfirmClear(false);
        } else {
            setConfirmClear(true);
            setTimeout(() => setConfirmClear(false), 3000);
        }
    };

    return (
        <div className="container mx-auto px-4 py-5 space-y-5">
            <div className="text-center space-y-2 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow animate-float">
                        <Clock className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold animated-gradient-text">{t('history.title')}</h1>
                </div>
                <p className="text-sm text-muted-foreground">{t('history.subtitle')}</p>
            </div>

            {history.length > 0 && (
                <div className="flex items-center justify-between animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">{history.length} calculs</Badge>
                        <Badge variant="outline" className="text-xs">Total: {formatPrice(totalCost)}</Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => exportCSV(history)}>
                            <Download className="h-3 w-3 mr-1" /> {t('history.export')}
                        </Button>
                        <Button
                            variant={confirmClear ? "destructive" : "outline"}
                            size="sm" className="text-xs h-8"
                            onClick={handleClear}
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {confirmClear ? t('common.confirm') : t('history.clear')}
                        </Button>
                    </div>
                </div>
            )}

            {history.length === 0 ? (
                <Card className="gradient-border">
                    <CardContent className="py-12 text-center">
                        <Clock className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">{t('history.empty')}</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2 stagger-children">
                    {history.map(entry => (
                        <Card key={entry.id} className="card-3d gradient-border group">
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="shrink-0">
                                        <div className="text-sm font-semibold">{entry.modelName}</div>
                                        <div className="text-[10px] text-muted-foreground">{entry.provider}</div>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1.5">
                                        <Badge variant="secondary" className="text-[10px]">
                                            In: {formatTokens(entry.inputTokens)}
                                        </Badge>
                                        <Badge variant="secondary" className="text-[10px]">
                                            Out: {formatTokens(entry.outputTokens)}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="font-mono text-sm font-bold text-primary">{formatPrice(entry.totalCost)}</div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {new Date(entry.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(entry.id)}
                                    >
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <UsageReconciliation />
        </div>
    );
}
