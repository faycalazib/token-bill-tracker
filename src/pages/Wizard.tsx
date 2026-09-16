import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { LLM_MODELS } from '@/data/llmModels';
import { formatPrice } from '@/utils/tokenCalculator';
import { HelpCircle, ChevronRight, ChevronLeft, RotateCcw, Star, Sparkles, Trophy } from 'lucide-react';

type BudgetLevel = 'low' | 'mid' | 'high';
type UseCase = 'chat' | 'code' | 'analysis' | 'creative';
type ContextNeed = 'short' | 'mid' | 'long';
type SpeedPriority = 'fast' | 'balanced' | 'quality';

const STEPS = ['budget', 'use', 'context', 'speed'] as const;

export default function WizardPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState(0);
    const [budget, setBudget] = useState<BudgetLevel | null>(null);
    const [useCase, setUseCase] = useState<UseCase | null>(null);
    const [context, setContext] = useState<ContextNeed | null>(null);
    const [speed, setSpeed] = useState<SpeedPriority | null>(null);

    const showResults = step >= STEPS.length;

    const recommendations = useMemo(() => {
        if (!budget || !useCase || !context || !speed) return [];

        return LLM_MODELS
            .filter(model => model.type === 'text' && (model.lifecycle ?? 'current') === 'current')
            .map(model => {
                let score = 50;
                const avgPrice = (model.inputPrice + model.outputPrice) / 2;

                // Budget scoring
                if (budget === 'low') score += avgPrice < 1 ? 30 : avgPrice < 5 ? 10 : -20;
                if (budget === 'mid') score += avgPrice < 10 ? 20 : avgPrice < 30 ? 10 : -10;
                if (budget === 'high') score += avgPrice > 5 ? 15 : 5;

                // Use case scoring
                const nameL = model.name.toLowerCase();
                const descL = model.description.toLowerCase();
                if (useCase === 'code' && (nameL.includes('coder') || descL.includes('code'))) score += 25;
                if (useCase === 'chat' && (nameL.includes('mini') || nameL.includes('flash') || descL.includes('chat'))) score += 15;
                if (useCase === 'analysis' && model.maxTokens >= 100000) score += 20;
                if (useCase === 'creative' && (nameL.includes('opus') || nameL.includes('gpt-5') || nameL.includes('pro'))) score += 20;

                // Context scoring
                if (context === 'long' && model.maxTokens >= 200000) score += 25;
                if (context === 'mid' && model.maxTokens >= 32000) score += 15;
                if (context === 'short') score += 5;

                // Speed scoring
                if (speed === 'fast' && (nameL.includes('mini') || nameL.includes('flash') || nameL.includes('haiku'))) score += 25;
                if (speed === 'quality' && (nameL.includes('opus') || nameL.includes('pro') || nameL.includes('gpt-5'))) score += 25;
                if (speed === 'balanced') score += 10;

                return { model, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }, [budget, useCase, context, speed]);

    const restart = () => { setStep(0); setBudget(null); setUseCase(null); setContext(null); setSpeed(null); };

    const canNext = (step === 0 && budget) || (step === 1 && useCase) || (step === 2 && context) || (step === 3 && speed);

    const OptionButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
        <button
            onClick={onClick}
            className={`w-full text-start rounded-xl p-3 border transition-all duration-300 ${selected
                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_hsl(142_86%_50%/0.15)]'
                    : 'border-border/30 hover:border-primary/30 hover:bg-secondary/30'
                }`}
        >
            {children}
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-5 max-w-2xl space-y-5">
            <div className="text-center space-y-2 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow animate-float">
                        <HelpCircle className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold animated-gradient-text">{t('wizard.title')}</h1>
                </div>
                <p className="text-sm text-muted-foreground">{t('wizard.subtitle')}</p>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1">
                {STEPS.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-border/30'}`} />
                ))}
            </div>

            {!showResults ? (
                <Card className="card-3d gradient-border animate-fade-in-up">
                    <CardContent className="p-5 space-y-4">
                        <h2 className="text-lg font-semibold">{t(`wizard.${STEPS[step]}`)}</h2>

                        <div className="space-y-2">
                            {step === 0 && (
                                <>
                                    <OptionButton selected={budget === 'low'} onClick={() => setBudget('low')}>{t('wizard.budget.low')}</OptionButton>
                                    <OptionButton selected={budget === 'mid'} onClick={() => setBudget('mid')}>{t('wizard.budget.mid')}</OptionButton>
                                    <OptionButton selected={budget === 'high'} onClick={() => setBudget('high')}>{t('wizard.budget.high')}</OptionButton>
                                </>
                            )}
                            {step === 1 && (
                                <>
                                    <OptionButton selected={useCase === 'chat'} onClick={() => setUseCase('chat')}>{t('wizard.use.chat')}</OptionButton>
                                    <OptionButton selected={useCase === 'code'} onClick={() => setUseCase('code')}>{t('wizard.use.code')}</OptionButton>
                                    <OptionButton selected={useCase === 'analysis'} onClick={() => setUseCase('analysis')}>{t('wizard.use.analysis')}</OptionButton>
                                    <OptionButton selected={useCase === 'creative'} onClick={() => setUseCase('creative')}>{t('wizard.use.creative')}</OptionButton>
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <OptionButton selected={context === 'short'} onClick={() => setContext('short')}>{t('wizard.context.short')}</OptionButton>
                                    <OptionButton selected={context === 'mid'} onClick={() => setContext('mid')}>{t('wizard.context.mid')}</OptionButton>
                                    <OptionButton selected={context === 'long'} onClick={() => setContext('long')}>{t('wizard.context.long')}</OptionButton>
                                </>
                            )}
                            {step === 3 && (
                                <>
                                    <OptionButton selected={speed === 'fast'} onClick={() => setSpeed('fast')}>{t('wizard.speed.fast')}</OptionButton>
                                    <OptionButton selected={speed === 'balanced'} onClick={() => setSpeed('balanced')}>{t('wizard.speed.balanced')}</OptionButton>
                                    <OptionButton selected={speed === 'quality'} onClick={() => setSpeed('quality')}>{t('wizard.speed.quality')}</OptionButton>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between pt-2">
                            <Button variant="outline" size="sm" disabled={step === 0} onClick={() => setStep(s => s - 1)}>
                                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> {t('wizard.prev')}
                            </Button>
                            <Button size="sm" disabled={!canNext} onClick={() => setStep(s => s + 1)}>
                                {step === STEPS.length - 1 ? t('wizard.results') : t('wizard.next')} <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3 animate-scale-in">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-400" />
                            {t('wizard.results')}
                        </h2>
                        <Button variant="outline" size="sm" onClick={restart}>
                            <RotateCcw className="h-3 w-3 mr-1" /> {t('wizard.restart')}
                        </Button>
                    </div>
                    <div className="space-y-2 stagger-children">
                        {recommendations.map(({ model, score }, i) => (
                            <Card key={model.id} className={`card-3d ${i === 0 ? 'gradient-border' : ''}`}>
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-gray-300/20 text-gray-400' : 'bg-amber-700/20 text-amber-600'
                                            }`}>
                                            {i < 3 ? <Star className="h-4 w-4" /> : `#${i + 1}`}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold flex items-center gap-1.5">
                                                {model.name}
                                                {i === 0 && <Sparkles className="h-3 w-3 text-yellow-400" />}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">{model.provider}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground">
                                            In: ${model.inputPrice}/M · Out: ${model.outputPrice}/M
                                        </div>
                                        <Badge variant={i === 0 ? "default" : "secondary"} className="text-[10px]">
                                            Score: {score}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
