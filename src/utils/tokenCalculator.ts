import { LLMModel, TokenCalculation } from '@/types/llm';
import { Tiktoken } from 'js-tiktoken/lite';

let openAITextEncoder: Tiktoken | null = null;
let openAILegacyEncoder: Tiktoken | null = null;
let tokenizerLoad: Promise<void> | null = null;

export const loadOpenAITokenizers = (): Promise<void> => {
  if (!tokenizerLoad) {
    tokenizerLoad = Promise.all([
      import('js-tiktoken/ranks/o200k_base'),
      import('js-tiktoken/ranks/cl100k_base'),
    ]).then(([modern, legacy]) => {
      openAITextEncoder = new Tiktoken(modern.default);
      openAILegacyEncoder = new Tiktoken(legacy.default);
    }).catch(error => { tokenizerLoad = null; throw error; });
  }
  return tokenizerLoad;
};

export type TokenCountMethod = 'openai-local' | 'estimate';

export const tokenCountMethod = (model: LLMModel): TokenCountMethod =>
  model.provider === 'OpenAI' && model.pricingUnit === 'tokens' && openAITextEncoder && openAILegacyEncoder
    ? 'openai-local' : 'estimate';

const usesLegacyEncoding = (model: LLMModel) => model.id.startsWith('gpt-3.5')
  || model.id === 'gpt-4' || model.id === 'gpt-4-turbo' || model.type === 'embedding';

export const tokenCountFamily = (model: LLMModel, useLocalTokenizer = true): 'estimate' | 'o200k' | 'cl100k' => {
  if (!useLocalTokenizer || tokenCountMethod(model) === 'estimate') return 'estimate';
  return usesLegacyEncoding(model) ? 'cl100k' : 'o200k';
};

export const countTokensForModel = (text: string, model: LLMModel, useLocalTokenizer = true): number => {
  if (!text) return 0;
  if (useLocalTokenizer && tokenCountMethod(model) === 'openai-local') {
    return (usesLegacyEncoding(model) ? openAILegacyEncoder! : openAITextEncoder!).encode(text).length;
  }
  return estimateTokens(text);
};

/**
 * Approximation de secours pour les modèles sans tokenizer local compatible.
 */
export const estimateTokens = (text: string): number => {
  if (!text || text.trim().length === 0) return 0;

  // Fallback explicite pour les fournisseurs sans tokenizer local compatible.
  // Les mots longs, chiffres et signes ont plus de poids qu'un simple nombre de mots.
  const segments = text.match(/[\p{L}\p{M}]+|\p{N}+|[^\p{L}\p{M}\p{N}\s]+/gu) ?? [];
  return segments.reduce((total, segment) => {
    if (/^\p{N}+$/u.test(segment)) return total + Math.ceil(segment.length / 3);
    if (/^[^\p{L}\p{M}\p{N}]+$/u.test(segment)) return total + Math.ceil(segment.length / 2);
    const nonLatin = (segment.match(/[^\p{Script=Latin}]/gu) ?? []).length;
    return total + Math.max(1, Math.ceil((segment.length - nonLatin) / 4 + nonLatin / 2));
  }, 0);
};

/**
 * Calcule les coûts détaillés pour un modèle donné
 */
export const calculateCosts = (
  inputText: string,
  outputText: string,
  model: LLMModel,
  useLocalTokenizer = true,
): TokenCalculation => {
  const inputTokens = countTokensForModel(inputText, model, useLocalTokenizer);
  const outputTokens = countTokensForModel(outputText, model, useLocalTokenizer);
  const totalTokens = inputTokens + outputTokens;

  const { inputCost, outputCost, requestCost, totalCost } = calculateTokenCosts(
    inputTokens,
    outputTokens,
    model,
  );

  return {
    inputTokens,
    outputTokens,
    totalTokens,
    inputCost,
    outputCost,
    requestCost,
    totalCost
  };
};

/**
 * Calcule un appel à partir de nombres de tokens déjà connus.
 * Gère les paliers long contexte et les frais fixes par requête.
 */
export const calculateTokenCosts = (
  inputTokens: number,
  outputTokens: number,
  model: LLMModel,
  requestCount = 1,
) => {
  const isLongContext = Boolean(
    model.longContextThreshold && inputTokens >= model.longContextThreshold,
  );
  const inputPrice = isLongContext
    ? model.longContextInputPrice ?? model.inputPrice
    : model.inputPrice;
  const outputPrice = isLongContext
    ? model.longContextOutputPrice ?? model.outputPrice
    : model.outputPrice;
  const inputCost = (inputTokens / 1_000_000) * inputPrice;
  const outputCost = (outputTokens / 1_000_000) * outputPrice;
  const requestCost = (model.requestPrice ?? 0) * requestCount;

  return {
    inputCost,
    outputCost,
    requestCost,
    totalCost: inputCost + outputCost + requestCost,
    isLongContext,
  };
};

/**
 * Formate le prix en dollars avec la précision appropriée
 */
export const formatPrice = (price: number): string => {
  if (price === 0) return '$0.00';
  if (price < 0.001) return `$${price.toFixed(6)}`;
  if (price < 0.01) return `$${price.toFixed(4)}`;
  if (price < 1) return `$${price.toFixed(3)}`;
  return `$${price.toFixed(2)}`;
};

/**
 * Formate le nombre de tokens avec séparateurs
 */
export const formatTokens = (tokens: number): string => {
  return tokens.toLocaleString('fr-FR');
};

/**
 * Calcule le ratio coût/performance (coût pour 1000 tokens)
 */
export const calculateCostPer1000Tokens = (cost: number, tokens: number): number => {
  if (tokens === 0) return 0;
  return (cost / tokens) * 1000;
};

/**
 * Détermine si un texte dépasse la limite de tokens d'un modèle
 */
export const exceedsTokenLimit = (inputText: string, outputText: string, model: LLMModel): boolean => {
  const totalTokens = countTokensForModel(inputText, model) + countTokensForModel(outputText, model);
  return totalTokens > model.maxTokens;
};
