import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import ModelSelector from '@/components/ModelSelector';
import { SpatialEmptyEstimate } from '@/components/spatial/ExperienceLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { getModelById } from '@/data/llmModels';
import { calculateTokenCosts, formatPrice, formatTokens } from '@/utils/tokenCalculator';
import { Users, DollarSign, Calendar, UserCheck } from 'lucide-react';

export default function TeamSimulatorPage() {
    const { t } = useLanguage();
    const [selectedModel, setSelectedModel] = useState('');
    const [devs, setDevs] = useState(5);
    const [promptsPerDay, setPromptsPerDay] = useState(30);
    const [avgTokens, setAvgTokens] = useState(2000);
    const [workingDays, setWorkingDays] = useState(22);
    const [outputRatio, setOutputRatio] = useState(60);

    const model = getModelById(selectedModel);

    const results = useMemo(() => {
        if (!model) return null;
        const totalPromptsMonth = devs * promptsPerDay * workingDays;
        const totalTokensMonth = totalPromptsMonth * avgTokens;
        const inputTokensPerPrompt = avgTokens * ((100 - outputRatio) / 100);
        const outputTokensPerPrompt = avgTokens * (outputRatio / 100);
        const perPrompt = calculateTokenCosts(inputTokensPerPrompt, outputTokensPerPrompt, model);
        const inputCost = perPrompt.inputCost * totalPromptsMonth;
        const outputCost = perPrompt.outputCost * totalPromptsMonth;
        const totalCost = perPrompt.totalCost * totalPromptsMonth;
        const costPerDev = totalCost / devs;
        const annualCost = totalCost * 12;
        return { totalPromptsMonth, totalTokensMonth, totalCost, costPerDev, annualCost, inputCost, outputCost };
    }, [model, devs, promptsPerDay, avgTokens, workingDays, outputRatio]);

    const Stat = ({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) => (
        <div className="rounded-xl bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors">
            <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
            <div className={`text-lg font-bold font-mono ${color || 'text-foreground'}`}>{value}</div>
            {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-5 space-y-5">
            <div className="text-center space-y-2 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow animate-float">
                        <Users className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold animated-gradient-text">{t('team.title')}</h1>
                </div>
                <p className="text-sm text-muted-foreground">{t('team.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card className="card-3d gradient-border animate-fade-in-up">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-primary" />
                            Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} filterType="text" />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-[10px]">{t('team.devs')}</Label>
                                <Input type="number" min="1" max="1000" value={devs}
                                    onChange={e => setDevs(parseInt(e.target.value) || 1)}
                                    className="h-8 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">{t('team.prompts.day')}</Label>
                                <Input type="number" min="1" max="500" value={promptsPerDay}
                                    onChange={e => setPromptsPerDay(parseInt(e.target.value) || 1)}
                                    className="h-8 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">{t('team.avg.tokens')}</Label>
                                <Input type="number" min="100" step="100" value={avgTokens}
                                    onChange={e => setAvgTokens(parseInt(e.target.value) || 100)}
                                    className="h-8 text-sm" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">{t('team.days')}</Label>
                                <Input type="number" min="1" max="31" value={workingDays}
                                    onChange={e => setWorkingDays(parseInt(e.target.value) || 1)}
                                    className="h-8 text-sm" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px]">Output ratio (%)</Label>
                            <Input type="number" min="0" max="100" value={outputRatio}
                                onChange={e => setOutputRatio(parseInt(e.target.value) || 0)}
                                className="h-8 text-sm" />
                        </div>
                    </CardContent>
                </Card>

                {!results && <SpatialEmptyEstimate variant="team" />}
                {results && (
                    <div className="space-y-4 animate-scale-in">
                        <div className="grid grid-cols-2 gap-3">
                            <Stat label={t('team.cost.dev')} value={formatPrice(results.costPerDev)} sub={`/ ${t('nav.calculator').toLowerCase()}`} color="text-primary" />
                            <Stat label={t('team.cost.team')} value={formatPrice(results.totalCost)} sub="/ mois" color="text-green-400" />
                            <Stat label={t('team.cost.year')} value={formatPrice(results.annualCost)} color="text-yellow-400" />
                            <Stat label="Tokens/mois" value={formatTokens(results.totalTokensMonth)} />
                        </div>
                        <Card className="gradient-border">
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">{t('cost.input')}</span>
                                        <span className="font-mono">{formatPrice(results.inputCost)}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                                        <div className="h-full bg-primary/60 rounded-full bar-animate"
                                            style={{ width: `${(results.inputCost / results.totalCost) * 100}%` }} />
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">{t('cost.output')}</span>
                                        <span className="font-mono">{formatPrice(results.outputCost)}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                                        <div className="h-full bg-green-500/60 rounded-full bar-animate"
                                            style={{ width: `${(results.outputCost / results.totalCost) * 100}%`, animationDelay: '200ms' }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
