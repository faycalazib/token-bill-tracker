import { useState, useMemo } from 'react';
import { LLMModel, ModelType } from '@/types/llm';
import { LLM_MODELS, SELECTABLE_MODELS } from '@/data/llmModels';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/tokenCalculator';
import { ChevronsUpDown, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange: (modelId: string) => void;
  placeholder?: string;
  filterType?: ModelType;
}

const providerEmojis: Record<string, string> = {
  'OpenAI': '🟢', 'Anthropic': '🟠', 'Google': '🔵', 'xAI': '⚪',
  'DeepSeek': '🟣', 'Meta': '🔷', 'Mistral': '🟡', 'Cohere': '🔴',
  'Qwen': '🟣', 'Amazon': '🟧', 'AI21': '🔹', 'Perplexity': '🔍',
  'Groq': '⚡', 'Cerebras': '🧠', 'Stability AI': '🎨',
  'Black Forest Labs': '🖼️', 'ElevenLabs': '🔊', 'Midjourney': '🌈',
  'Ideogram': '✏️', 'Runway': '🎬', 'Kuaishou': '🎥', 'MiniMax': '📹',
};

const typeLabels: Record<ModelType, { label: string; emoji: string; color: string }> = {
  'text': { label: 'Texte', emoji: '💬', color: 'bg-blue-500/10 text-blue-400' },
  'image': { label: 'Image', emoji: '🎨', color: 'bg-pink-500/10 text-pink-400' },
  'audio': { label: 'Audio', emoji: '🔊', color: 'bg-green-500/10 text-green-400' },
  'video': { label: 'Vidéo', emoji: '🎬', color: 'bg-purple-500/10 text-purple-400' },
  'embedding': { label: 'Embed', emoji: '🔢', color: 'bg-yellow-500/10 text-yellow-400' },
};

const pricingLabels: Record<string, string> = {
  'tokens': '/1M tok', 'images': '/img', 'minutes': '/min',
  'seconds': '/sec', 'characters': '/1M chars',
};

const lifecycleLabels = {
  current: { label: 'Actuel', className: 'bg-emerald-500/10 text-emerald-400' },
  legacy: { label: 'Legacy', className: 'bg-amber-500/10 text-amber-400' },
} as const;

export default function ModelSelector({ selectedModel, onModelChange, placeholder = "Choisissez votre modèle", filterType }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [activeType, setActiveType] = useState<ModelType | 'all'>(filterType || 'all');

  const selectedModelData = useMemo(() => LLM_MODELS.find(m => m.id === selectedModel), [selectedModel]);

  const filteredModels = useMemo(() => {
    const models = activeType === 'all'
      ? SELECTABLE_MODELS
      : SELECTABLE_MODELS.filter(m => m.type === activeType);
    return [...models].sort((a, b) => {
      const aOrder = (a.lifecycle ?? 'current') === 'current' ? 0 : 1;
      const bOrder = (b.lifecycle ?? 'current') === 'current' ? 0 : 1;
      return aOrder - bOrder;
    });
  }, [activeType]);

  const groupedModels = useMemo(() => {
    return filteredModels.reduce((acc, model) => {
      if (!acc[model.provider]) acc[model.provider] = [];
      acc[model.provider].push(model);
      return acc;
    }, {} as Record<string, LLMModel[]>);
  }, [filteredModels]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_15px_hsl(142_86%_50%/0.1)]"
        >
          {selectedModelData ? (
            <div className="flex items-center gap-2 truncate">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: `hsl(var(--${selectedModelData.color}))` }} />
              <span className="truncate text-sm">{selectedModelData.name}</span>
              <span className="text-[10px] text-muted-foreground">{selectedModelData.provider}</span>
              {selectedModelData.type !== 'text' && (
                <span className={`text-[9px] px-1 py-0.5 rounded-full ${typeLabels[selectedModelData.type].color}`}>
                  {typeLabels[selectedModelData.type].emoji}
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 glass-strong" align="start">
        <Command filter={(value, search) => {
          const model = LLM_MODELS.find(m => m.id === value);
          if (!model) return 0;
          const s = search.toLowerCase();
          if (model.name.toLowerCase().includes(s)) return 1;
          if (model.provider.toLowerCase().includes(s)) return 0.8;
          if (model.description.toLowerCase().includes(s)) return 0.5;
          if (model.type.includes(s)) return 0.6;
          return 0;
        }}>
          <CommandInput placeholder="Rechercher un modèle..." className="h-9 text-sm" />

          {/* Type filter tabs */}
          {!filterType && (
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border/30 flex-wrap">
              <button
                onClick={() => setActiveType('all')}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors',
                  activeType === 'all' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Tous ({SELECTABLE_MODELS.length})
              </button>
              {(Object.keys(typeLabels) as ModelType[]).map(type => {
                const count = SELECTABLE_MODELS.filter(m => m.type === type).length;
                if (count === 0) return null;
                const info = typeLabels[type];
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={cn(
                      'px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors',
                      activeType === type ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {info.emoji} {count}
                  </button>
                );
              })}
            </div>
          )}

          <CommandList className="max-h-[350px]">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              Aucun modèle trouvé
            </CommandEmpty>
            {Object.entries(groupedModels).map(([provider, models]) => (
              <CommandGroup
                key={provider}
                heading={
                  <div className="flex items-center gap-1.5">
                    <span>{providerEmojis[provider] || '⬜'}</span>
                    {provider}
                    <span className="ml-auto text-[10px] font-normal opacity-60">{models.length}</span>
                  </div>
                }
              >
                {models.map((model) => (
                  <CommandItem
                    key={model.id}
                    value={model.id}
                    onSelect={(val) => {
                      onModelChange(val);
                      setOpen(false);
                    }}
                    className="py-1.5 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-1.5 h-3 w-3 shrink-0',
                        selectedModel === model.id ? 'opacity-100 text-primary' : 'opacity-0'
                      )}
                    />
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: `hsl(var(--${model.color}))` }}
                        />
                        <span className="font-medium text-sm truncate">{model.name}</span>
                        {model.type !== 'text' && (
                          <span className={`text-[9px] px-1 py-0.5 rounded-full shrink-0 ${typeLabels[model.type].color}`}>
                            {typeLabels[model.type].emoji}
                          </span>
                        )}
                        {model.multimodal && (
                          <span className="text-[9px] px-1 py-0.5 rounded-full bg-violet-500/10 text-violet-400 shrink-0">👁️</span>
                        )}
                        {model.lifecycle === 'legacy' && (
                          <span className={`text-[9px] px-1 py-0.5 rounded-full shrink-0 ${lifecycleLabels.legacy.className}`}>
                            {lifecycleLabels.legacy.label}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap shrink-0">
                        {model.type === 'text' || model.type === 'embedding'
                          ? `${formatPrice(model.inputPrice)} / ${formatPrice(model.outputPrice)}`
                          : `${formatPrice(model.inputPrice)}${pricingLabels[model.pricingUnit]}`
                        }
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
