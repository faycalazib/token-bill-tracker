import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import ModelSelector from '@/components/ModelSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { getModelById } from '@/data/llmModels';
import { calculateTokenCosts, formatPrice, formatTokens } from '@/utils/tokenCalculator';
import { GitBranch, Plus, Trash2, Zap, ArrowDown } from 'lucide-react';

interface PipelineStep {
    id: string;
    modelId: string;
    inputTokens: number;
    outputTokens: number;
    description: string;
}

const createStep = (): PipelineStep => ({
    id: crypto.randomUUID(),
    modelId: '',
    inputTokens: 1000,
    outputTokens: 2000,
    description: '',
});

export default function PipelinePage() {
    const { t } = useLanguage();
    const [steps, setSteps] = useState<PipelineStep[]>([createStep()]);

    const updateStep = (id: string, updates: Partial<PipelineStep>) => {
        setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const removeStep = (id: string) => {
        setSteps(prev => prev.filter(s => s.id !== id));
    };

    const results = useMemo(() => {
        return steps.map(step => {
            const model = getModelById(step.modelId);
            if (!model) return { ...step, model: null, cost: 0 };
            const { totalCost } = calculateTokenCosts(step.inputTokens, step.outputTokens, model);
            return { ...step, model, cost: totalCost };
        });
    }, [steps]);

    const totalCost = results.reduce((s, r) => s + r.cost, 0);
    const totalTokens = steps.reduce((s, st) => s + st.inputTokens + st.outputTokens, 0);

    return (
        <div className="container mx-auto px-4 py-5 space-y-5">
            <div className="text-center space-y-2 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow animate-float">
                        <GitBranch className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold animated-gradient-text">{t('pipeline.title')}</h1>
                </div>
                <p className="text-sm text-muted-foreground">{t('pipeline.subtitle')}</p>
            </div>

            <div className="space-y-3 stagger-children">
                {steps.map((step, index) => {
                    const result = results[index];
                    return (
                        <div key={step.id}>
                            {index > 0 && (
                                <div className="flex justify-center py-1">
                                    <ArrowDown className="h-4 w-4 text-primary/50 animate-float" />
                                </div>
                            )}
                            <Card className="card-3d gradient-border">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px]">{t('pipeline.step')} {index + 1}</Badge>
                                            {result?.model && (
                                                <span className="text-xs text-muted-foreground">{result.model.name}</span>
                                            )}
                                        </CardTitle>
                                        {steps.length > 1 && (
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeStep(step.id)}>
                                                <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <ModelSelector selectedModel={step.modelId} onModelChange={id => updateStep(step.id, { modelId: id })} filterType="text" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-muted-foreground">{t('cost.input')} tokens</Label>
                                            <Input type="number" min="0" step="100" value={step.inputTokens}
                                                onChange={e => updateStep(step.id, { inputTokens: parseInt(e.target.value) || 0 })}
                                                className="h-8 text-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-muted-foreground">{t('cost.output')} tokens</Label>
                                            <Input type="number" min="0" step="100" value={step.outputTokens}
                                                onChange={e => updateStep(step.id, { outputTokens: parseInt(e.target.value) || 0 })}
                                                className="h-8 text-sm" />
                                        </div>
                                    </div>
                                    {result?.model && (
                                        <div className="text-right">
                                            <span className="font-mono text-sm font-bold text-primary">{formatPrice(result.cost)}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2 animate-fade-in-up">
                <Button variant="outline" className="flex-1 h-9 text-sm" onClick={() => setSteps(prev => [...prev, createStep()])}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> {t('pipeline.add')}
                </Button>
            </div>

            <Card className="gradient-border animate-fade-in-up">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs text-muted-foreground">{t('pipeline.total')}</div>
                            <div className="text-2xl font-bold font-mono text-primary">{formatPrice(totalCost)}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground">{steps.length} {t('pipeline.step').toLowerCase()}s · {formatTokens(totalTokens)} tokens</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
