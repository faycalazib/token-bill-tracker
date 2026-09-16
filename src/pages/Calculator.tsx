import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ModelSelector from '@/components/ModelSelector';
import CostDisplay from '@/components/CostDisplay';
import MonthlyProjection from '@/components/MonthlyProjection';
import PriceProvenance from '@/components/PriceProvenance';
import CostWorkflow from '@/components/CostWorkflow';
import { SpatialEmptyEstimate } from '@/components/spatial/ExperienceLayout';
import { SELECTABLE_MODELS, getModelById } from '@/data/llmModels';
import { calculateCosts, calculateTokenCosts, countTokensForModel, estimateTokens, tokenCountFamily, tokenCountMethod, exceedsTokenLimit, formatTokens, formatPrice } from '@/utils/tokenCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { addHistory } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { useTokenizerReady } from '@/hooks/useTokenizerReady';
import { Calculator, AlertTriangle, Zap, Sparkles, TrendingUp, TrendingDown, Users, DollarSign, Percent, Save, BarChart3, ArrowRight } from 'lucide-react';

const formatComparisonPrice = (price: number) => {
  if (price > 0 && price < 0.000000001) return `$${price.toExponential(2)}`;
  if (price > 0 && price < 0.000001) {
    return `$${price.toFixed(9).replace(/0+$/, '').replace(/\.$/, '')}`;
  }
  return formatPrice(price);
};

export default function CalculatorPage() {
  const tokenizerReady = useTokenizerReady();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [showComparisons, setShowComparisons] = useState(false);

  const handleSave = () => {
    if (!currentCalculation) return;
    const { model, calculation } = currentCalculation;
    addHistory({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      modelId: model.id,
      modelName: model.name,
      provider: model.provider,
      inputText: inputText.slice(0, 200),
      outputText: outputText.slice(0, 200),
      inputTokens: calculation.inputTokens,
      outputTokens: calculation.outputTokens,
      totalCost: calculation.totalCost,
    });
    toast({ title: '✅ Saved', description: `${model.name} — ${formatPrice(calculation.totalCost)}` });
  };

  // SaaS Plan Simulator
  const [planPrice, setPlanPrice] = useState<number>(20);
  const [numUsers, setNumUsers] = useState<number>(1);
  const [promptsPerUser, setPromptsPerUser] = useState<number>(100);
  const [tokensPerPrompt, setTokensPerPrompt] = useState<number>(20000);
  const [outputSharePercent, setOutputSharePercent] = useState<number>(50);

  const currentCalculation = useMemo(() => {
    const model = getModelById(selectedModel);
    if (!model || (!inputText && !outputText)) return null;
    return {
      model,
      calculation: calculateCosts(inputText, outputText, model, tokenizerReady)
    };
  }, [selectedModel, inputText, outputText, tokenizerReady]);
  const selectedModelDetails = getModelById(selectedModel);

  const allComparisons = useMemo(() => {
    if (!inputText && !outputText) return [];
    const counts = new Map<string, { inputTokens: number; outputTokens: number }>();
    return SELECTABLE_MODELS.filter(model => model.type === 'text').map(model => {
      const family = tokenCountFamily(model, tokenizerReady);
      let tokens = counts.get(family);
      if (!tokens) {
        tokens = {
          inputTokens: countTokensForModel(inputText, model, tokenizerReady),
          outputTokens: countTokensForModel(outputText, model, tokenizerReady),
        };
        counts.set(family, tokens);
      }
      const costs = calculateTokenCosts(tokens.inputTokens, tokens.outputTokens, model);
      return { model, calculation: { ...tokens, totalTokens: tokens.inputTokens + tokens.outputTokens, ...costs } };
    }).sort((a, b) => a.calculation.totalCost - b.calculation.totalCost);
  }, [inputText, outputText, tokenizerReady]);

  const maxCost = allComparisons.length > 0 ? allComparisons[allComparisons.length - 1]?.calculation.totalCost || 1 : 1;
  const medianCost = allComparisons.length > 0
    ? (allComparisons[Math.floor((allComparisons.length - 1) / 2)].calculation.totalCost
      + allComparisons[Math.floor(allComparisons.length / 2)].calculation.totalCost) / 2
    : 0;
  const topProviders = allComparisons.filter((item, index) =>
    allComparisons.findIndex(candidate => candidate.model.provider === item.model.provider) === index
  ).slice(0, 3);

  const exceedsLimit = currentCalculation &&
    exceedsTokenLimit(inputText, outputText, currentCalculation.model);

  const saasSimulation = useMemo(() => {
    const model = getModelById(selectedModel);
    if (!model) return null;

    const totalTokens = Math.max(0, (tokensPerPrompt || 0) * (promptsPerUser || 0) * (numUsers || 0));
    const outputTokens = Math.round(totalTokens * (Math.min(100, Math.max(0, outputSharePercent)) / 100));
    const inputTokens = totalTokens - outputTokens;

    const requests = Math.max(0, (promptsPerUser || 0) * (numUsers || 0));
    const inputTokensPerRequest = requests > 0 ? inputTokens / requests : 0;
    const outputTokensPerRequest = requests > 0 ? outputTokens / requests : 0;
    const perRequest = calculateTokenCosts(inputTokensPerRequest, outputTokensPerRequest, model);
    const inputCost = perRequest.inputCost * requests;
    const outputCost = perRequest.outputCost * requests;
    const providerCost = perRequest.totalCost * requests;

    const revenue = (planPrice || 0) * (numUsers || 0);
    const profit = revenue - providerCost;
    const marginPercent = revenue > 0 ? (profit / revenue) * 100 : 0;

    return { totalTokens, inputTokens, outputTokens, providerCost, revenue, profit, marginPercent, model };
  }, [selectedModel, tokensPerPrompt, promptsPerUser, numUsers, planPrice, outputSharePercent]);

  return (
    <div id="calculator-workspace" className="container mx-auto px-4 py-5 space-y-5">
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in-up">
        <div className="flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow animate-float">
            <Calculator className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold animated-gradient-text">
            Calculateur de Coûts LLM
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Estimez vos coûts API en collant vos textes d'entrée/sortie
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column - Inputs */}
        <div className="space-y-4 stagger-children">
          <Card className="card-3d gradient-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Configuration
              </CardTitle>
              <CardDescription className="text-xs">
                Modèle LLM + textes d'entrée/sortie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="model" className="text-xs">Modèle LLM</Label>
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  filterType="text"
                  placeholder="Choisissez votre modèle"
                />
                {selectedModel && (() => {
                  const model = getModelById(selectedModel);
                  if (!model) return null;
                  return (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {model.provider}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        Max: {formatTokens(model.maxTokens)} tokens
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {tokenCountMethod(model) === 'openai-local' ? t('tokens.local') : t('tokens.estimated')}
                      </Badge>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="input" className="text-xs">Input (prompt)</Label>
                <Textarea
                  id="input"
                  placeholder="Collez votre prompt ici..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-24 resize-y text-sm transition-all focus:shadow-[0_0_15px_hsl(142_86%_50%/0.1)]"
                />
                {inputText && (
                  <div className="text-[10px] text-muted-foreground">
                    {formatTokens(selectedModelDetails ? countTokensForModel(inputText, selectedModelDetails) : estimateTokens(inputText))} tokens · {selectedModelDetails && tokenCountMethod(selectedModelDetails) === 'openai-local' ? t('tokens.local') : t('tokens.estimated')}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="output" className="text-xs">Output (réponse)</Label>
                <Textarea
                  id="output"
                  placeholder="Collez la réponse du LLM ici..."
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                  className="min-h-24 resize-y text-sm transition-all focus:shadow-[0_0_15px_hsl(142_86%_50%/0.1)]"
                />
                {outputText && (
                  <div className="text-[10px] text-muted-foreground">
                    {formatTokens(selectedModelDetails ? countTokensForModel(outputText, selectedModelDetails) : estimateTokens(outputText))} tokens · {selectedModelDetails && tokenCountMethod(selectedModelDetails) === 'openai-local' ? t('tokens.local') : t('tokens.estimated')}
                  </div>
                )}
              </div>

              {exceedsLimit && (
                <Alert variant="destructive" className="py-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <AlertDescription className="text-xs">
                    Le nombre de tokens dépasse la limite du modèle.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {(inputText || outputText) && (
            <div className="flex gap-2 animate-scale-in">
              <Button
                onClick={() => setShowComparisons(!showComparisons)}
                variant={showComparisons ? "default" : "outline"}
                className="flex-1 text-sm h-9 transition-all duration-300"
              >
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                {showComparisons ? t('calc.hide') : t('calc.compare')}
              </Button>
              {currentCalculation && (
                <Button onClick={handleSave} variant="outline" className="text-sm h-9">
                  <Save className="h-3.5 w-3.5 mr-1.5" /> {t('calc.save')}
                </Button>
              )}
              <Button
                onClick={() => { setInputText(''); setOutputText(''); setSelectedModel(''); }}
                variant="outline"
                className="text-sm h-9"
              >
                {t('calc.clear')}
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        <div className="space-y-4">
          {!currentCalculation && !showComparisons && <SpatialEmptyEstimate />}
          {!currentCalculation && showComparisons && allComparisons.length > 0 && (
            <Card className="card-3d gradient-border animate-scale-in">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  {t('calc.overview.title')}
                </CardTitle>
                <CardDescription className="text-xs">{t('calc.overview.desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-secondary/50 p-2.5 text-center">
                    <div className="text-base font-bold text-primary">{formatTokens(allComparisons.length)}</div>
                    <div className="text-[10px] text-muted-foreground">{t('calc.overview.models')}</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2.5 text-center">
                    <div className="text-base font-bold text-primary">{formatTokens(allComparisons[0].calculation.totalTokens)}</div>
                    <div className="text-[10px] text-muted-foreground">{t('calc.overview.tokens')}</div>
                    <div className="text-[9px] text-muted-foreground">
                      {formatTokens(allComparisons[0].calculation.inputTokens)} {t('cost.input')} · {formatTokens(allComparisons[0].calculation.outputTokens)} {t('cost.output')}
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2.5 text-center">
                    <div className="text-sm font-bold text-primary font-mono break-all">{formatComparisonPrice(medianCost)}</div>
                    <div className="text-[10px] text-muted-foreground">{t('calc.overview.median')}</div>
                  </div>
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t('calc.overview.cheapest')}</div>
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{allComparisons[0].model.name}</div>
                      <div className="text-xs text-muted-foreground">{allComparisons[0].model.provider}</div>
                    </div>
                    <div className="font-mono text-lg font-bold text-primary break-all text-end">{formatComparisonPrice(allComparisons[0].calculation.totalCost)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('calc.overview.top')}</h3>
                  {topProviders.map(({ model, calculation }) => (
                    <button key={model.id} type="button" onClick={() => setSelectedModel(model.id)}
                      className="flex w-full items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 px-3 py-2 text-start transition-colors hover:border-primary/40 hover:bg-primary/10">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: `hsl(var(--${model.color}))` }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium">{model.name}</span>
                        <span className="block text-[10px] text-muted-foreground">{model.provider}</span>
                      </span>
                      <span className="shrink-0 font-mono text-xs font-semibold text-primary">{formatComparisonPrice(calculation.totalCost)}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] leading-relaxed text-muted-foreground">{t('calc.overview.note')}</p>
              </CardContent>
            </Card>
          )}
          {currentCalculation && (
            <><CostDisplay calculation={currentCalculation.calculation} />
              <div className="rounded-lg border border-border/40 bg-secondary/20 p-3"><PriceProvenance model={currentCalculation.model} /></div>
            </>
          )}
        </div>
      </div>

      {/* Comparison — Full width below */}
      {showComparisons && allComparisons.length > 0 && (
        <Card className="card-3d gradient-border animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-primary" />
              Comparaison
            </CardTitle>
            <CardDescription className="text-xs">
              Du moins cher au plus cher
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 stagger-children">
              {allComparisons.map((comparison, index) => {
                const barWidth = maxCost > 0 ? (comparison.calculation.totalCost / maxCost) * 100 : 0;
                return (
                  <div
                    key={comparison.model.id}
                    data-comparison-item
                    className={`relative flex items-center justify-between rounded-lg p-2 transition-all duration-300 overflow-hidden group ${comparison.model.id === selectedModel
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-secondary/40'
                      }`}
                  >
                    {/* Background bar */}
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/5 bar-animate rounded-lg"
                      style={{ width: `${barWidth}%`, animationDelay: `${index * 40}ms` }}
                    />

                    <div className="flex items-center gap-2 relative z-10">
                      <span className="text-[10px] font-mono text-muted-foreground w-5">
                        {index + 1}.
                      </span>
                      <div
                        className="h-2 w-2 rounded-full transition-transform group-hover:scale-150"
                        style={{ backgroundColor: `hsl(var(--${comparison.model.color}))` }}
                      />
                      <div>
                        <div className="text-xs font-medium leading-tight">{comparison.model.name}</div>
                        <div className="text-[10px] text-muted-foreground">{comparison.model.provider}</div>
                      </div>
                    </div>
                    <div className="text-right relative z-10">
                      <div className="font-mono text-xs font-semibold text-primary">
                        {formatComparisonPrice(comparison.calculation.totalCost)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <MonthlyProjection onSelectModel={setSelectedModel} />

      <CostWorkflow />

      {/* SaaS Simulator */}
      <Card className="card-3d gradient-border animate-fade-in-up">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Simulateur SaaS
          </CardTitle>
          <CardDescription className="text-xs">
            Estimez votre marge selon le modèle et l'usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedModel ? (
            <Alert className="py-2">
              <AlertDescription className="text-xs">
                Sélectionnez d'abord un modèle LLM.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="planPrice" className="text-[10px] text-muted-foreground">Prix/user/mois ($)</Label>
                  <Input id="planPrice" type="number" step="0.01" min="0" value={planPrice}
                    onChange={(e) => setPlanPrice(parseFloat(e.target.value) || 0)}
                    className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="numUsers" className="text-[10px] text-muted-foreground">Utilisateurs</Label>
                  <Input id="numUsers" type="number" min="0" step="1" value={numUsers}
                    onChange={(e) => setNumUsers(parseInt(e.target.value || '0', 10) || 0)}
                    className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="promptsPerUser" className="text-[10px] text-muted-foreground">Prompts/user/mois</Label>
                  <Input id="promptsPerUser" type="number" min="0" step="1" value={promptsPerUser}
                    onChange={(e) => setPromptsPerUser(parseInt(e.target.value || '0', 10) || 0)}
                    className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tokensPerPrompt" className="text-[10px] text-muted-foreground">Tokens/prompt</Label>
                  <Input id="tokensPerPrompt" type="number" min="0" step="100" value={tokensPerPrompt}
                    onChange={(e) => setTokensPerPrompt(parseInt(e.target.value || '0', 10) || 0)}
                    className="h-8 text-sm" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="outputShare" className="text-[10px] text-muted-foreground">Part output (%)</Label>
                  <Input id="outputShare" type="number" min="0" max="100" step="5" value={outputSharePercent}
                    onChange={(e) => {
                      const v = parseInt(e.target.value || '0', 10) || 0;
                      setOutputSharePercent(Math.max(0, Math.min(100, v)));
                    }}
                    className="h-8 text-sm" />
                </div>
              </div>

              {saasSimulation && (
                <div className="space-y-3 stagger-children">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-secondary/30 p-2.5 hover-glow">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Zap className="h-3 w-3" /> Tokens/mois
                      </div>
                      <div className="font-mono text-sm font-semibold mt-0.5">{formatTokens(saasSimulation.totalTokens)}</div>
                    </div>
                    <div className="rounded-lg bg-secondary/30 p-2.5 hover-glow">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <TrendingDown className="h-3 w-3" /> Coût provider
                      </div>
                      <div className="font-mono text-sm font-semibold mt-0.5">{formatPrice(saasSimulation.providerCost)}</div>
                    </div>
                    <div className="rounded-lg bg-secondary/30 p-2.5 hover-glow">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <DollarSign className="h-3 w-3" /> Revenu
                      </div>
                      <div className="font-mono text-sm font-semibold mt-0.5">{formatPrice(saasSimulation.revenue)}</div>
                    </div>
                    <div className={`rounded-lg p-2.5 hover-glow ${saasSimulation.profit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Users className="h-3 w-3" /> Marge
                      </div>
                      <div className={`font-mono text-sm font-semibold mt-0.5 ${saasSimulation.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPrice(saasSimulation.profit)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3 border border-primary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Percent className="h-3 w-3" /> Marge
                      </span>
                      <span className={`text-lg font-bold font-mono ${saasSimulation.marginPercent >= 0 ? 'text-primary' : 'text-red-400'}`}>
                        {saasSimulation.marginPercent.toFixed(1)}%
                      </span>
                    </div>
                    {/* Margin bar */}
                    <div className="mt-2 h-1.5 w-full rounded-full bg-secondary/50 overflow-hidden">
                      <div
                        className="h-full rounded-full bar-animate transition-all duration-500"
                        style={{
                          width: `${Math.max(0, Math.min(100, saasSimulation.marginPercent))}%`,
                          background: saasSimulation.marginPercent >= 50 ? 'hsl(142 76% 36%)' : saasSimulation.marginPercent >= 0 ? 'hsl(45 100% 50%)' : 'hsl(0 84% 60%)'
                        }}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {formatTokens(saasSimulation.inputTokens)} input · {formatTokens(saasSimulation.outputTokens)} output ({outputSharePercent}%)
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
