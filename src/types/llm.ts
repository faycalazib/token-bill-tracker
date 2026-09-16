export type ModelType = 'text' | 'image' | 'audio' | 'video' | 'embedding';
export type PricingUnit = 'tokens' | 'images' | 'minutes' | 'seconds' | 'characters';
export type ModelLifecycle = 'current' | 'legacy' | 'retired';

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  type: ModelType;
  pricingUnit: PricingUnit;
  inputPrice: number; // Prix par 1M tokens (text/embedding), par image, par minute (audio), par seconde (video)
  outputPrice: number; // Prix par 1M tokens d'output, 0 pour image/audio/video
  maxTokens: number; // 0 pour les modèles non-texte
  color: string;
  description: string;
  multimodal?: boolean; // true si le modèle accepte aussi images/audio en entrée
  cachedInputPrice?: number; // Prix par 1M tokens lus depuis le cache
  longContextThreshold?: number; // Seuil d'entrée déclenchant le tarif long contexte
  longContextInputPrice?: number;
  longContextOutputPrice?: number;
  requestPrice?: number; // Frais fixes par requête, en plus des tokens
  pricingNote?: string;
  sourceUrl?: string;
  verifiedAt?: string;
  lifecycle?: ModelLifecycle;
  replacementId?: string;
  retirementDate?: string;
}

export interface TokenCalculation {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCost: number;
  outputCost: number;
  requestCost?: number;
  totalCost: number;
}

export interface ComparisonResult {
  model: LLMModel;
  calculation: TokenCalculation;
}

export interface CalculationHistory {
  id: string;
  timestamp: Date;
  model: LLMModel;
  inputText: string;
  outputText: string;
  calculation: TokenCalculation;
}
