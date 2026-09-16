import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LLM_MODELS } from '@/data/llmModels';
import { ModelLifecycle, ModelType } from '@/types/llm';
import { formatPrice, formatTokens } from '@/utils/tokenCalculator';
import { BarChart3, Cpu, DollarSign, ArrowDownUp, Layers, ExternalLink } from 'lucide-react';

const providerEmojis: Record<string, string> = {
  'OpenAI': '🟢', 'Anthropic': '🟠', 'Google': '🔵', 'xAI': '⚪',
  'DeepSeek': '🟣', 'Meta': '🔷', 'Mistral': '🟡', 'Cohere': '🔴',
  'Qwen': '🟣', 'Amazon': '🟧', 'AI21': '🔹', 'Perplexity': '🔍',
  'Groq': '⚡', 'Cerebras': '🧠', 'Stability AI': '🎨',
  'Black Forest Labs': '🖼️', 'ElevenLabs': '🔊', 'Midjourney': '🌈',
  'Ideogram': '✏️', 'Runway': '🎬', 'Kuaishou': '🎥', 'MiniMax': '📹',
};

const typeConfig: Record<ModelType, { label: string; emoji: string; color: string; inputLabel: string; outputLabel: string; unit: string; statsLabel: string }> = {
  'text': { label: 'Texte', emoji: '💬', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', inputLabel: 'Prix Input / 1M tokens', outputLabel: 'Prix Output / 1M tokens', unit: '/1M tok', statsLabel: 'Max contexte' },
  'image': { label: 'Image', emoji: '🎨', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30', inputLabel: 'Prix par image', outputLabel: '', unit: '/img', statsLabel: 'Modèles' },
  'audio': { label: 'Audio', emoji: '🔊', color: 'bg-green-500/10 text-green-400 border-green-500/30', inputLabel: 'Prix (par min ou 1M chars)', outputLabel: '', unit: '', statsLabel: 'Modèles' },
  'video': { label: 'Vidéo', emoji: '🎬', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', inputLabel: 'Prix par seconde', outputLabel: '', unit: '/sec', statsLabel: 'Modèles' },
  'embedding': { label: 'Embed', emoji: '🔢', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', inputLabel: 'Prix Input / 1M tokens', outputLabel: '', unit: '/1M tok', statsLabel: 'Max contexte' },
};

const pricingUnitLabels: Record<string, string> = {
  'tokens': '/1M tok', 'images': '/img', 'minutes': '/min',
  'seconds': '/sec', 'characters': '/1M chars',
};

const lifecycleConfig: Record<ModelLifecycle, { label: string; className: string }> = {
  current: { label: 'Actuel', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  legacy: { label: 'Legacy', className: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  retired: { label: 'Historique', className: 'bg-red-500/10 text-red-400 border-red-500/30' },
};

const getLifecycle = (model: { lifecycle?: ModelLifecycle }): ModelLifecycle => model.lifecycle ?? 'current';

export default function ComparisonsPage() {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<ModelType>('text');
  const [selectedLifecycle, setSelectedLifecycle] = useState<ModelLifecycle | 'all'>('current');

  const allTypeModels = useMemo(() => LLM_MODELS.filter(m => m.type === selectedType), [selectedType]);
  const typeModels = useMemo(() => {
    if (selectedLifecycle === 'all') return allTypeModels;
    return allTypeModels.filter(model => getLifecycle(model) === selectedLifecycle);
  }, [allTypeModels, selectedLifecycle]);

  const filteredModels = useMemo(() => {
    if (selectedProvider === 'all') return typeModels;
    return typeModels.filter(m => m.provider === selectedProvider);
  }, [selectedProvider, typeModels]);

  // Only show providers that have models of the selected type
  const availableProviders = useMemo(() => {
    return Array.from(new Set(typeModels.map(m => m.provider)));
  }, [typeModels]);

  const sortedByInput = [...filteredModels].sort((a, b) => a.inputPrice - b.inputPrice);
  const sortedByOutput = [...filteredModels].sort((a, b) => a.outputPrice - b.outputPrice);

  const stats = useMemo(() => {
    if (filteredModels.length === 0) return null;
    const inputPrices = filteredModels.map(m => m.inputPrice);
    const outputPrices = filteredModels.map(m => m.outputPrice);
    const maxTokensList = filteredModels.map(m => m.maxTokens).filter(t => t > 0);
    return {
      avgInput: inputPrices.reduce((a, b) => a + b, 0) / inputPrices.length,
      avgOutput: outputPrices.reduce((a, b) => a + b, 0) / outputPrices.length,
      maxContext: maxTokensList.length > 0 ? Math.max(...maxTokensList) : 0,
      totalModels: filteredModels.length,
    };
  }, [filteredModels]);

  const maxInputPrice = sortedByInput.length > 0 ? sortedByInput[sortedByInput.length - 1].inputPrice : 1;
  const maxOutputPrice = sortedByOutput.length > 0 ? sortedByOutput[sortedByOutput.length - 1].outputPrice : 1;
  const tc = typeConfig[selectedType];
  const hasOutput = selectedType === 'text';

  // Reset provider when type changes
  const handleTypeChange = (type: ModelType) => {
    setSelectedType(type);
    setSelectedProvider('all');
  };

  return (
    <div className="container mx-auto px-4 py-5 space-y-5">
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in-up">
        <div className="flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow animate-float">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold animated-gradient-text">
            Comparaisons & Analyse
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Modèles actuels, générations legacy et tarifs historiques
        </p>
      </div>

      {/* Lifecycle filter — retired models are only exposed on this page */}
      <div className="flex flex-wrap gap-1.5 justify-center animate-fade-in-up">
        {(['current', 'legacy', 'retired'] as ModelLifecycle[]).map(lifecycle => {
          const config = lifecycleConfig[lifecycle];
          const count = allTypeModels.filter(model => getLifecycle(model) === lifecycle).length;
          return (
            <Badge
              key={lifecycle}
              variant={selectedLifecycle === lifecycle ? 'default' : 'outline'}
              className={`cursor-pointer text-xs px-3 py-1 ${selectedLifecycle === lifecycle ? '' : config.className}`}
              onClick={() => {
                setSelectedLifecycle(lifecycle);
                setSelectedProvider('all');
              }}
            >
              {config.label} ({count})
            </Badge>
          );
        })}
        <Badge
          variant={selectedLifecycle === 'all' ? 'default' : 'outline'}
          className="cursor-pointer text-xs px-3 py-1"
          onClick={() => {
            setSelectedLifecycle('all');
            setSelectedProvider('all');
          }}
        >
          Tous ({allTypeModels.length})
        </Badge>
      </div>

      {/* Type Filter — Primary */}
      <div className="flex flex-wrap gap-1.5 justify-center animate-fade-in-up">
        {(Object.keys(typeConfig) as ModelType[]).map(type => {
          const count = LLM_MODELS.filter(m => m.type === type).length;
          if (count === 0) return null;
          const cfg = typeConfig[type];
          return (
            <Badge
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              className={`cursor-pointer text-xs px-3 py-1 transition-all duration-300 hover:shadow-glow ${selectedType === type ? '' : cfg.color
                }`}
              onClick={() => handleTypeChange(type)}
            >
              {cfg.emoji} {cfg.label} ({count})
            </Badge>
          );
        })}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className={`grid grid-cols-2 ${hasOutput ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-3 stagger-children`}>
          <Card className="card-3d gradient-border overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                <Cpu className="h-3 w-3" /> {tc.emoji} Modèles
              </div>
              <div className="text-2xl font-bold text-primary">{stats.totalModels}</div>
              <div className="text-[10px] text-muted-foreground">{availableProviders.length} providers</div>
            </CardContent>
          </Card>
          <Card className="card-3d gradient-border overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                <DollarSign className="h-3 w-3" /> Prix moyen
              </div>
              <div className="text-2xl font-bold text-primary">{formatPrice(stats.avgInput)}</div>
              <div className="text-[10px] text-muted-foreground">{tc.unit || 'par unité'}</div>
            </CardContent>
          </Card>
          {hasOutput && (
            <Card className="card-3d gradient-border overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                  <ArrowDownUp className="h-3 w-3" /> Output moyen
                </div>
                <div className="text-2xl font-bold text-primary">{formatPrice(stats.avgOutput)}</div>
                <div className="text-[10px] text-muted-foreground">/1M tokens</div>
              </CardContent>
            </Card>
          )}
          {stats.maxContext > 0 && (
            <Card className="card-3d gradient-border overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                  <Layers className="h-3 w-3" /> {tc.statsLabel}
                </div>
                <div className="text-2xl font-bold text-primary">{formatTokens(stats.maxContext)}</div>
                <div className="text-[10px] text-muted-foreground">tokens</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Provider Filter — Secondary */}
      <div className="flex flex-wrap gap-1.5 animate-fade-in-up">
        <Badge
          variant={selectedProvider === 'all' ? 'default' : 'outline'}
          className="cursor-pointer text-xs px-2.5 py-0.5 transition-all duration-300 hover:shadow-glow"
          onClick={() => setSelectedProvider('all')}
        >
          Tous ({typeModels.length})
        </Badge>
        {availableProviders.map(provider => {
          const count = typeModels.filter(m => m.provider === provider).length;
          return (
            <Badge
              key={provider}
              variant={selectedProvider === provider ? 'default' : 'outline'}
              className="cursor-pointer text-xs px-2.5 py-0.5 transition-all duration-300 hover:shadow-glow"
              onClick={() => setSelectedProvider(provider)}
            >
              {providerEmojis[provider] || '⬜'} {provider} ({count})
            </Badge>
          );
        })}
      </div>

      {/* Pricing Tabs */}
      <Tabs defaultValue="input" className="animate-fade-in-up">
        <TabsList className="glass-strong">
          <TabsTrigger value="input" className="text-xs">
            {hasOutput ? 'Prix Input' : 'Classement Prix'}
          </TabsTrigger>
          {hasOutput && (
            <TabsTrigger value="output" className="text-xs">
              Prix Output
            </TabsTrigger>
          )}
          <TabsTrigger value="details" className="text-xs">
            Détails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-3">
          <Card className="gradient-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                {tc.inputLabel}
              </CardTitle>
              <CardDescription className="text-xs">Du moins cher au plus cher</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 stagger-children">
                {sortedByInput.map((model, index) => {
                  const barWidth = maxInputPrice > 0 ? (model.inputPrice / maxInputPrice) * 100 : 0;
                  return (
                    <div key={model.id} className="relative flex items-center justify-between rounded-lg p-2 overflow-hidden group hover:bg-secondary/30 transition-all">
                      <div
                        className="absolute inset-y-0 left-0 rounded-lg bar-animate"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: `hsl(var(--${model.color}) / 0.1)`,
                          animationDelay: `${index * 40}ms`
                        }}
                      />
                      <div className="flex items-center gap-2 relative z-10">
                        <span className="text-[10px] font-mono text-muted-foreground w-5">{index + 1}.</span>
                        <div
                          className="h-2 w-2 rounded-full transition-transform group-hover:scale-150"
                          style={{ backgroundColor: `hsl(var(--${model.color}))` }}
                        />
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            {model.name}
                            {getLifecycle(model) !== 'current' && (
                              <span className={`rounded-full border px-1 py-0.5 text-[8px] ${lifecycleConfig[getLifecycle(model)].className}`}>
                                {lifecycleConfig[getLifecycle(model)].label}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{model.provider}</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-primary relative z-10">
                        {formatPrice(model.inputPrice)}{pricingUnitLabels[model.pricingUnit] ? ` ${pricingUnitLabels[model.pricingUnit]}` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {hasOutput && (
          <TabsContent value="output" className="mt-3">
            <Card className="gradient-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  {tc.outputLabel}
                </CardTitle>
                <CardDescription className="text-xs">Du moins cher au plus cher</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5 stagger-children">
                  {sortedByOutput.map((model, index) => {
                    const barWidth = maxOutputPrice > 0 ? (model.outputPrice / maxOutputPrice) * 100 : 0;
                    return (
                      <div key={model.id} className="relative flex items-center justify-between rounded-lg p-2 overflow-hidden group hover:bg-secondary/30 transition-all">
                        <div
                          className="absolute inset-y-0 left-0 rounded-lg bar-animate"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: `hsl(var(--${model.color}) / 0.1)`,
                            animationDelay: `${index * 40}ms`
                          }}
                        />
                        <div className="flex items-center gap-2 relative z-10">
                          <span className="text-[10px] font-mono text-muted-foreground w-5">{index + 1}.</span>
                          <div
                            className="h-2 w-2 rounded-full transition-transform group-hover:scale-150"
                            style={{ backgroundColor: `hsl(var(--${model.color}))` }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                              {model.name}
                              {getLifecycle(model) !== 'current' && (
                                <span className={`rounded-full border px-1 py-0.5 text-[8px] ${lifecycleConfig[getLifecycle(model)].className}`}>
                                  {lifecycleConfig[getLifecycle(model)].label}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{model.provider}</div>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-primary relative z-10">
                          {formatPrice(model.outputPrice)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="details" className="mt-3">
          <div className="space-y-3 stagger-children">
            {availableProviders
              .filter(p => selectedProvider === 'all' || p === selectedProvider)
              .map(provider => {
                const models = typeModels.filter(m => m.provider === provider);
                return (
                  <Card key={provider} className="card-3d gradient-border overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <span>{providerEmojis[provider] || '⬜'}</span>
                        {provider}
                        <Badge variant="secondary" className="text-[10px] ml-auto">
                          {models.length} modèles
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {models.map(model => (
                          <div
                            key={model.id}
                            className="flex items-start gap-2.5 rounded-lg bg-secondary/20 p-2.5 hover-glow transition-all group"
                          >
                            <div
                              className="mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 transition-transform group-hover:scale-150"
                              style={{ backgroundColor: `hsl(var(--${model.color}))` }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium flex items-center gap-1.5">
                                {model.name}
                                <span className={`rounded-full border px-1.5 py-0.5 text-[9px] ${lifecycleConfig[getLifecycle(model)].className}`}>
                                  {lifecycleConfig[getLifecycle(model)].label}
                                </span>
                                {model.multimodal && (
                                  <span className="text-[9px] px-1 py-0.5 rounded-full bg-violet-500/10 text-violet-400">👁️</span>
                                )}
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{model.description}</div>
                              <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {hasOutput ? `In: ${formatPrice(model.inputPrice)}` : formatPrice(model.inputPrice)}
                                  {pricingUnitLabels[model.pricingUnit] ? ` ${pricingUnitLabels[model.pricingUnit]}` : ''}
                                </Badge>
                                {hasOutput && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    Out: {formatPrice(model.outputPrice)}
                                  </Badge>
                                )}
                                {model.maxTokens > 0 && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    {formatTokens(model.maxTokens)}
                                  </Badge>
                                )}
                                {model.cachedInputPrice !== undefined && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    Cache: {formatPrice(model.cachedInputPrice)} /1M
                                  </Badge>
                                )}
                                {model.longContextThreshold !== undefined && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    Long: {formatPrice(model.longContextInputPrice ?? model.inputPrice)} / {formatPrice(model.longContextOutputPrice ?? model.outputPrice)}
                                  </Badge>
                                )}
                                {model.requestPrice !== undefined && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                    +{formatPrice(model.requestPrice)} /req
                                  </Badge>
                                )}
                              </div>
                              {model.pricingNote && (
                                <div className="mt-1.5 text-[10px] leading-relaxed text-amber-500">
                                  {model.pricingNote}
                                </div>
                              )}
                              {getLifecycle(model) === 'retired' && (
                                <div className="mt-1.5 text-[10px] leading-relaxed text-red-400">
                                  Modèle non sélectionnable
                                  {model.retirementDate ? ` · retiré le ${model.retirementDate}` : ''}
                                  {model.replacementId ? ` · remplacement : ${model.replacementId}` : ''}
                                </div>
                              )}
                              {model.sourceUrl && (
                                <a
                                  href={model.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                                >
                                  Source officielle · vérifié le {model.verifiedAt}
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
