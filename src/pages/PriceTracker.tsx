import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { SELECTABLE_MODELS } from '@/data/llmModels';
import { getPriceSnapshots, addPriceSnapshot, PriceSnapshot } from '@/utils/storage';
import PriceProvenance from '@/components/PriceProvenance';
import { TrendingUp, Camera, Clock, ArrowUp, ArrowDown, Minus } from 'lucide-react';

function PriceCatalog() {
    const { t } = useLanguage();
    return <Card className="gradient-border animate-fade-in-up">
        <CardHeader className="pb-2"><CardTitle className="text-sm">{t('prices.catalog')}</CardTitle></CardHeader>
        <CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SELECTABLE_MODELS.map(model => <div key={model.id} className="rounded-lg border border-border/30 p-2.5 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><div className="text-xs font-medium">{model.name}</div><div className="text-[10px] text-muted-foreground">{model.provider}</div></div>
                    <div className="shrink-0 text-right text-[10px] font-mono"><div>In: ${model.inputPrice}/M</div><div>Out: ${model.outputPrice}/M</div></div>
                </div>
                <div className="mt-2"><PriceProvenance model={model} compact /></div>
                {model.pricingNote && <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{model.pricingNote}</p>}
            </div>)}
        </div></CardContent>
    </Card>;
}

export default function PriceTrackerPage() {
    const { t } = useLanguage();
    const [snapshots, setSnapshots] = useState<PriceSnapshot[]>(getPriceSnapshots);

    const takeSnapshot = () => {
        const snapshot: PriceSnapshot = {
            date: new Date().toISOString(),
            models: SELECTABLE_MODELS.map(m => ({ id: m.id, inputPrice: m.inputPrice, outputPrice: m.outputPrice })),
        };
        addPriceSnapshot(snapshot);
        setSnapshots(getPriceSnapshots());
    };

    const latestSnapshot = snapshots[snapshots.length - 1];
    const previousSnapshot = snapshots.length >= 2 ? snapshots[snapshots.length - 2] : null;

    const changes = latestSnapshot && previousSnapshot ? SELECTABLE_MODELS.map(model => {
        const latest = latestSnapshot.models.find(m => m.id === model.id);
        const previous = previousSnapshot.models.find(m => m.id === model.id);
        if (!latest || !previous) return null;
        const inputDiff = latest.inputPrice - previous.inputPrice;
        const outputDiff = latest.outputPrice - previous.outputPrice;
        if (inputDiff === 0 && outputDiff === 0) return null;
        return { model, inputDiff, outputDiff };
    }).filter((change): change is NonNullable<typeof change> => change !== null) : [];

    return (
        <div className="container mx-auto px-4 py-5 space-y-5">
            <div className="text-center space-y-2 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow animate-float">
                        <TrendingUp className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold animated-gradient-text">{t('prices.title')}</h1>
                </div>
                <p className="text-sm text-muted-foreground">{t('prices.subtitle')}</p>
            </div>

            <div className="flex items-center justify-between animate-fade-in-up">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                        {snapshots.length} snapshots
                    </Badge>
                    {latestSnapshot && (
                        <Badge variant="outline" className="text-xs">
                            {t('prices.last.snapshot')}: {new Date(latestSnapshot.date).toLocaleDateString()}
                        </Badge>
                    )}
                </div>
                <Button onClick={takeSnapshot} size="sm" className="h-8 text-xs">
                    <Camera className="h-3 w-3 mr-1.5" />
                    {t('prices.snapshot')}
                </Button>
            </div>

            {snapshots.length === 0 ? (
                <><Card className="gradient-border">
                    <CardContent className="py-12 text-center">
                        <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">{t('prices.no.history')}</p>
                    </CardContent>
                </Card><PriceCatalog /></>
            ) : (
                <div className="space-y-4">
                    {changes.length > 0 && (
                        <Card className="gradient-border animate-scale-in">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    Changements de prix
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Depuis le snapshot précédent
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1.5">
                                    {changes.map(change => (
                                        <div key={change.model.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary/30 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `hsl(var(--${change.model.color}))` }} />
                                                <span className="text-xs font-medium">{change.model.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px]">
                                                <span className={change.inputDiff > 0 ? 'text-red-400' : change.inputDiff < 0 ? 'text-green-400' : ''}>
                                                    {change.inputDiff > 0 ? <ArrowUp className="inline h-3 w-3" /> : change.inputDiff < 0 ? <ArrowDown className="inline h-3 w-3" /> : <Minus className="inline h-3 w-3" />}
                                                    In: {change.inputDiff > 0 ? '+' : ''}{change.inputDiff.toFixed(2)}
                                                </span>
                                                <span className={change.outputDiff > 0 ? 'text-red-400' : change.outputDiff < 0 ? 'text-green-400' : ''}>
                                                    {change.outputDiff > 0 ? <ArrowUp className="inline h-3 w-3" /> : change.outputDiff < 0 ? <ArrowDown className="inline h-3 w-3" /> : <Minus className="inline h-3 w-3" />}
                                                    Out: {change.outputDiff > 0 ? '+' : ''}{change.outputDiff.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <PriceCatalog />

                    {/* Snapshot history */}
                    <Card className="gradient-border animate-fade-in-up">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                Historique des snapshots
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {[...snapshots].reverse().map((snap, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg p-2 hover:bg-secondary/30 transition-colors">
                                        <span className="text-xs">{new Date(snap.date).toLocaleString()}</span>
                                        <Badge variant="secondary" className="text-[10px]">{snap.models.length} modèles</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
