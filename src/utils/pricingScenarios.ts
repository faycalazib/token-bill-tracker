import type { LLMModel } from '@/types/llm';
import { calculateTokenCosts } from '@/utils/tokenCalculator';

// Remises de traitement différé documentées pour les API Claude et Gemini.
export const batchDiscountRate = (model: LLMModel): number | null =>
  model.provider === 'Anthropic' || model.provider === 'Google' ? 0.5 : null;

export function calculateMonthlyScenarios(
  model: LLMModel,
  requests: number,
  inputTokensPerRequest: number,
  outputTokensPerRequest: number,
  cacheHitPercent: number,
) {
  const count = Math.max(0, Math.floor(requests));
  const input = Math.max(0, Math.floor(inputTokensPerRequest));
  const output = Math.max(0, Math.floor(outputTokensPerRequest));
  const perRequest = calculateTokenCosts(input, output, model);
  const standard = perRequest.totalCost * count;
  const cacheShare = Math.min(1, Math.max(0, cacheHitPercent / 100));
  const cached = model.cachedInputPrice === undefined ? null :
    ((input * (1 - cacheShare) * (perRequest.isLongContext ? model.longContextInputPrice ?? model.inputPrice : model.inputPrice)
      + input * cacheShare * model.cachedInputPrice) / 1_000_000
      + perRequest.outputCost + perRequest.requestCost) * count;
  const discount = batchDiscountRate(model);
  const batch = discount === null ? null :
    ((perRequest.inputCost + perRequest.outputCost) * (1 - discount) + perRequest.requestCost) * count;

  return { standard, cached, batch };
}
