import { LLMModel } from '@/types/llm';
import { PRICING_LAST_VERIFIED, PRICING_SOURCES } from '@/data/currentTokenModels';

type CatalogModel = Omit<LLMModel, 'type' | 'pricingUnit' | 'sourceUrl' | 'verifiedAt' | 'lifecycle'>;

const catalogModel = (
  sourceUrl: string,
  lifecycle: 'legacy' | 'retired',
  model: CatalogModel,
): LLMModel => ({
  type: 'text',
  pricingUnit: 'tokens',
  sourceUrl,
  verifiedAt: PRICING_LAST_VERIFIED,
  lifecycle,
  ...model,
});

const legacy = (sourceUrl: string, model: CatalogModel) => catalogModel(sourceUrl, 'legacy', model);
const retired = (sourceUrl: string, model: CatalogModel) => catalogModel(sourceUrl, 'retired', model);

const openAI = (model: CatalogModel) => legacy(PRICING_SOURCES.OpenAI, model);
const oldOpenAI = (model: CatalogModel) => retired('https://developers.openai.com/api/docs/models/all', model);
const anthropic = (model: CatalogModel) => legacy(PRICING_SOURCES.Anthropic, model);
const oldAnthropic = (model: CatalogModel) => retired('https://platform.claude.com/docs/en/about-claude/model-deprecations', model);
const google = (model: CatalogModel) => legacy(PRICING_SOURCES.Google, model);
const oldGoogle = (model: CatalogModel) => retired('https://ai.google.dev/gemini-api/docs/deprecations', model);
const oldDeepSeek = (model: CatalogModel) => retired('https://api-docs.deepseek.com/quick_start/pricing-details-usd', model);
const oldMistral = (model: CatalogModel) => retired('https://docs.mistral.ai/models/', model);

/**
 * Modèles d'anciennes générations encore accessibles (legacy), puis modèles
 * retirés conservés à titre historique avec leur dernier tarif public standard.
 */
export const LEGACY_TOKEN_MODELS: LLMModel[] = [
  // OpenAI — générations précédentes toujours accessibles.
  openAI({ id: 'gpt-5.5', name: 'GPT-5.5', provider: 'OpenAI', inputPrice: 5, cachedInputPrice: 0.5, outputPrice: 30, longContextThreshold: 272001, longContextInputPrice: 10, longContextOutputPrice: 45, maxTokens: 1050000, multimodal: true, color: 'openai', description: 'Ancien modèle phare pour le code et le travail professionnel' }),
  openAI({ id: 'gpt-5.5-pro', name: 'GPT-5.5 Pro', provider: 'OpenAI', inputPrice: 30, outputPrice: 180, maxTokens: 1050000, multimodal: true, color: 'openai', description: 'Version Pro de GPT-5.5 à calcul renforcé' }),
  openAI({ id: 'gpt-5.4', name: 'GPT-5.4', provider: 'OpenAI', inputPrice: 2.5, cachedInputPrice: 0.25, outputPrice: 15, maxTokens: 1050000, multimodal: true, color: 'openai', description: 'Ancienne génération généraliste pour code et agents' }),
  openAI({ id: 'gpt-5.4-pro', name: 'GPT-5.4 Pro', provider: 'OpenAI', inputPrice: 30, outputPrice: 180, maxTokens: 1050000, multimodal: true, color: 'openai', description: 'Version Pro de GPT-5.4' }),
  openAI({ id: 'gpt-5.4-mini', name: 'GPT-5.4 Mini', provider: 'OpenAI', inputPrice: 0.75, cachedInputPrice: 0.075, outputPrice: 4.5, maxTokens: 400000, multimodal: true, color: 'openai', description: 'GPT-5.4 compact pour les gros volumes' }),
  openAI({ id: 'gpt-5.4-nano', name: 'GPT-5.4 Nano', provider: 'OpenAI', inputPrice: 0.2, cachedInputPrice: 0.02, outputPrice: 1.25, maxTokens: 400000, multimodal: true, color: 'openai', description: 'GPT-5.4 économique pour extraction et classification' }),
  openAI({ id: 'gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', inputPrice: 1.75, cachedInputPrice: 0.175, outputPrice: 14, maxTokens: 400000, multimodal: true, color: 'openai', description: 'Précédent modèle phare professionnel' }),
  openAI({ id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro', provider: 'OpenAI', inputPrice: 21, outputPrice: 168, maxTokens: 400000, multimodal: true, color: 'openai', description: 'Ancienne variante Pro à raisonnement intensif' }),
  openAI({ id: 'gpt-5.1', name: 'GPT-5.1', provider: 'OpenAI', inputPrice: 1.25, cachedInputPrice: 0.125, outputPrice: 10, maxTokens: 400000, multimodal: true, color: 'openai', description: 'Génération précédente orientée code et agents' }),
  openAI({ id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', inputPrice: 1.25, cachedInputPrice: 0.125, outputPrice: 10, maxTokens: 400000, multimodal: true, color: 'openai', description: 'Première génération GPT-5 généraliste' }),
  openAI({ id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'OpenAI', inputPrice: 0.25, cachedInputPrice: 0.025, outputPrice: 2, maxTokens: 400000, multimodal: true, color: 'openai', description: 'GPT-5 compact et économique' }),
  openAI({ id: 'gpt-5-nano', name: 'GPT-5 Nano', provider: 'OpenAI', inputPrice: 0.05, cachedInputPrice: 0.005, outputPrice: 0.4, maxTokens: 400000, multimodal: true, color: 'openai', description: 'GPT-5 à très faible coût' }),
  openAI({ id: 'o3-pro', name: 'o3 Pro', provider: 'OpenAI', inputPrice: 20, outputPrice: 80, maxTokens: 200000, multimodal: true, color: 'openai', description: 'Ancien modèle de raisonnement à calcul renforcé' }),
  openAI({ id: 'o3', name: 'o3', provider: 'OpenAI', inputPrice: 2, cachedInputPrice: 0.5, outputPrice: 8, maxTokens: 200000, multimodal: true, color: 'openai', description: 'Ancien modèle de raisonnement complexe' }),
  openAI({ id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', inputPrice: 2, cachedInputPrice: 0.5, outputPrice: 8, maxTokens: 1047576, multimodal: true, color: 'openai', description: 'Modèle non-reasoning à contexte 1M' }),
  openAI({ id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'OpenAI', inputPrice: 0.4, cachedInputPrice: 0.1, outputPrice: 1.6, maxTokens: 1047576, multimodal: true, color: 'openai', description: 'Version compacte de GPT-4.1' }),
  openAI({ id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', inputPrice: 2.5, cachedInputPrice: 1.25, outputPrice: 10, maxTokens: 128000, multimodal: true, color: 'openai', description: 'Ancien modèle multimodal Omni' }),
  openAI({ id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', inputPrice: 0.15, cachedInputPrice: 0.075, outputPrice: 0.6, maxTokens: 128000, multimodal: true, color: 'openai', description: 'Version économique de GPT-4o' }),

  // OpenAI — dépréciés ou retirés, visibles seulement dans l'historique.
  oldOpenAI({ id: 'gpt-5-pro', name: 'GPT-5 Pro', provider: 'OpenAI', inputPrice: 15, outputPrice: 120, maxTokens: 400000, multimodal: true, color: 'openai', replacementId: 'gpt-5.5-pro', description: 'Ancienne version Pro de GPT-5' }),
  oldOpenAI({ id: 'o4-mini', name: 'o4-mini', provider: 'OpenAI', inputPrice: 1.1, cachedInputPrice: 0.275, outputPrice: 4.4, maxTokens: 200000, multimodal: true, color: 'openai', replacementId: 'gpt-5-mini', description: 'Ancien petit modèle de raisonnement' }),
  oldOpenAI({ id: 'o1-pro', name: 'o1 Pro', provider: 'OpenAI', inputPrice: 150, outputPrice: 600, maxTokens: 200000, multimodal: true, color: 'openai', replacementId: 'o3-pro', description: 'Ancienne variante Pro de la série o1' }),
  oldOpenAI({ id: 'o1', name: 'o1', provider: 'OpenAI', inputPrice: 15, cachedInputPrice: 7.5, outputPrice: 60, maxTokens: 200000, multimodal: true, color: 'openai', replacementId: 'o3', description: 'Premier modèle de raisonnement complet de la série o' }),
  oldOpenAI({ id: 'o3-mini', name: 'o3-mini', provider: 'OpenAI', inputPrice: 1.1, cachedInputPrice: 0.55, outputPrice: 4.4, maxTokens: 200000, color: 'openai', replacementId: 'gpt-5-mini', description: 'Ancien petit modèle de raisonnement' }),
  oldOpenAI({ id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', provider: 'OpenAI', inputPrice: 0.1, cachedInputPrice: 0.025, outputPrice: 0.4, maxTokens: 1047576, multimodal: true, color: 'openai', replacementId: 'gpt-5-nano', description: 'Ancienne variante la moins chère de GPT-4.1' }),
  oldOpenAI({ id: 'gpt-4.5-preview', name: 'GPT-4.5 Preview', provider: 'OpenAI', inputPrice: 75, cachedInputPrice: 37.5, outputPrice: 150, maxTokens: 128000, multimodal: true, color: 'openai', replacementId: 'gpt-5.4', description: 'Ancien preview GPT-4.5' }),
  oldOpenAI({ id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', inputPrice: 10, outputPrice: 30, maxTokens: 128000, multimodal: true, color: 'openai', replacementId: 'gpt-4.1', description: 'Ancienne génération GPT-4 Turbo' }),
  oldOpenAI({ id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', inputPrice: 30, outputPrice: 60, maxTokens: 8192, color: 'openai', replacementId: 'gpt-4.1', description: 'Première génération GPT-4' }),
  oldOpenAI({ id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', inputPrice: 0.5, outputPrice: 1.5, maxTokens: 16385, color: 'openai', replacementId: 'gpt-5-nano', description: 'Ancien modèle conversationnel économique' }),

  // Anthropic — actifs mais hors gamme Claude principale.
  anthropic({ id: 'claude-fable-5', name: 'Claude Fable 5', provider: 'Anthropic', inputPrice: 10, cachedInputPrice: 1, outputPrice: 50, maxTokens: 1000000, multimodal: true, color: 'anthropic', description: 'Première version de Claude Fable 5' }),
  anthropic({ id: 'claude-opus-4-8', name: 'Claude Opus 4.8', provider: 'Anthropic', inputPrice: 5, cachedInputPrice: 0.5, outputPrice: 25, maxTokens: 1000000, multimodal: true, color: 'anthropic', description: 'Ancienne génération Opus encore active' }),
  anthropic({ id: 'claude-opus-4-7', name: 'Claude Opus 4.7', provider: 'Anthropic', inputPrice: 5, cachedInputPrice: 0.5, outputPrice: 25, maxTokens: 1000000, multimodal: true, color: 'anthropic', description: 'Ancienne génération Opus encore active' }),
  anthropic({ id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic', inputPrice: 5, cachedInputPrice: 0.5, outputPrice: 25, maxTokens: 1000000, multimodal: true, color: 'anthropic', description: 'Ancienne génération Opus avec contexte 1M' }),
  anthropic({ id: 'claude-opus-4-5-20251101', name: 'Claude Opus 4.5', provider: 'Anthropic', inputPrice: 5, cachedInputPrice: 0.5, outputPrice: 25, maxTokens: 200000, multimodal: true, color: 'anthropic', description: 'Snapshot Opus 4.5 encore actif' }),
  anthropic({ id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', inputPrice: 3, cachedInputPrice: 0.3, outputPrice: 15, maxTokens: 1000000, multimodal: true, color: 'anthropic', description: 'Ancienne génération Sonnet encore active' }),
  anthropic({ id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', provider: 'Anthropic', inputPrice: 3, cachedInputPrice: 0.3, outputPrice: 15, maxTokens: 200000, multimodal: true, color: 'anthropic', description: 'Snapshot Sonnet 4.5 encore actif' }),

  // Anthropic — modèles retirés de l'API Claude directe.
  oldAnthropic({ id: 'claude-opus-4-1-20250805', name: 'Claude Opus 4.1', provider: 'Anthropic', inputPrice: 15, cachedInputPrice: 1.5, outputPrice: 75, maxTokens: 200000, multimodal: true, color: 'anthropic', retirementDate: '2026-08-05', replacementId: 'claude-opus-4-8', description: 'Retiré de l’API Claude directe' }),
  oldAnthropic({ id: 'claude-opus-4-20250514', name: 'Claude Opus 4', provider: 'Anthropic', inputPrice: 15, cachedInputPrice: 1.5, outputPrice: 75, maxTokens: 200000, multimodal: true, color: 'anthropic', retirementDate: '2026-06-15', replacementId: 'claude-opus-4-8', description: 'Retiré de l’API Claude directe' }),
  oldAnthropic({ id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', provider: 'Anthropic', inputPrice: 3, cachedInputPrice: 0.3, outputPrice: 15, maxTokens: 200000, multimodal: true, color: 'anthropic', retirementDate: '2026-06-15', replacementId: 'claude-sonnet-4-6', description: 'Retiré de l’API Claude directe' }),
  oldAnthropic({ id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', provider: 'Anthropic', inputPrice: 3, cachedInputPrice: 0.3, outputPrice: 15, maxTokens: 200000, multimodal: true, color: 'anthropic', retirementDate: '2026-02-19', replacementId: 'claude-sonnet-4-6', description: 'Ancien Sonnet à raisonnement étendu' }),
  oldAnthropic({ id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputPrice: 3, cachedInputPrice: 0.3, outputPrice: 15, maxTokens: 200000, multimodal: true, color: 'anthropic', retirementDate: '2025-10-28', replacementId: 'claude-sonnet-4-6', description: 'Ancienne génération Claude Sonnet' }),
  oldAnthropic({ id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'Anthropic', inputPrice: 0.8, cachedInputPrice: 0.08, outputPrice: 4, maxTokens: 200000, multimodal: true, color: 'anthropic', retirementDate: '2026-02-19', replacementId: 'claude-haiku-4-5-20251001', description: 'Ancienne génération Claude Haiku' }),
  oldAnthropic({ id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'Anthropic', inputPrice: 15, cachedInputPrice: 1.5, outputPrice: 75, maxTokens: 200000, multimodal: true, color: 'anthropic', retirementDate: '2026-01-05', replacementId: 'claude-opus-4-8', description: 'Ancienne génération Claude Opus' }),
  oldAnthropic({ id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic', inputPrice: 0.25, cachedInputPrice: 0.025, outputPrice: 1.25, maxTokens: 200000, multimodal: true, color: 'anthropic', retirementDate: '2026-04-20', replacementId: 'claude-haiku-4-5-20251001', description: 'Ancienne génération Claude Haiku' }),

  // Google — modèles précédents toujours tarifés dans la Gemini Developer API.
  google({ id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', provider: 'Google', inputPrice: 0.75, cachedInputPrice: 0.075, outputPrice: 3.75, maxTokens: 1000000, multimodal: true, color: 'google', pricingNote: 'Tarif promotionnel jusqu’au 31 décembre 2026.', description: 'Génération Flash précédente pour code et agents' }),
  google({ id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', provider: 'Google', inputPrice: 0.75, cachedInputPrice: 0.075, outputPrice: 3.75, maxTokens: 1000000, multimodal: true, color: 'google', pricingNote: 'Tarif promotionnel jusqu’au 31 décembre 2026.', description: 'Ancienne génération Flash multimodale' }),
  google({ id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', provider: 'Google', inputPrice: 1.5, cachedInputPrice: 0.15, outputPrice: 9, maxTokens: 1000000, multimodal: true, color: 'google', description: 'Flash historique pour charges à haut volume' }),
  google({ id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite', provider: 'Google', inputPrice: 0.25, cachedInputPrice: 0.025, outputPrice: 1.5, maxTokens: 1000000, multimodal: true, color: 'google', retirementDate: '2027-05-07', replacementId: 'gemini-3.5-flash-lite', description: 'Ancien Flash-Lite pour traitements simples' }),
  google({ id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview', provider: 'Google', inputPrice: 2, cachedInputPrice: 0.2, outputPrice: 12, longContextThreshold: 200001, longContextInputPrice: 4, longContextOutputPrice: 18, maxTokens: 1000000, multimodal: true, color: 'google', description: 'Preview Pro pour raisonnement et code agentique' }),
  google({ id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', inputPrice: 1.25, cachedInputPrice: 0.125, outputPrice: 10, longContextThreshold: 200001, longContextInputPrice: 2.5, longContextOutputPrice: 15, maxTokens: 1000000, multimodal: true, color: 'google', description: 'Ancien modèle Pro hybride à contexte 1M' }),
  google({ id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', inputPrice: 0.3, cachedInputPrice: 0.03, outputPrice: 2.5, maxTokens: 1000000, multimodal: true, color: 'google', description: 'Premier Flash avec budget de raisonnement' }),
  google({ id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', provider: 'Google', inputPrice: 0.1, cachedInputPrice: 0.01, outputPrice: 0.4, maxTokens: 1000000, multimodal: true, color: 'google', description: 'Ancien Gemini économique pour très gros volumes' }),

  // Google — endpoints arrêtés, prix conservés pour comparaison historique.
  oldGoogle({ id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', provider: 'Google', inputPrice: 2, cachedInputPrice: 0.2, outputPrice: 12, longContextThreshold: 200001, longContextInputPrice: 4, longContextOutputPrice: 18, maxTokens: 1000000, multimodal: true, color: 'google', retirementDate: '2026-03-09', replacementId: 'gemini-3.1-pro-preview', description: 'Ancien preview Gemini 3 Pro' }),
  oldGoogle({ id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', provider: 'Google', inputPrice: 0.5, cachedInputPrice: 0.05, outputPrice: 3, maxTokens: 1000000, multimodal: true, color: 'google', replacementId: 'gemini-3.6-flash', description: 'Ancien preview Gemini 3 Flash' }),
  oldGoogle({ id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', inputPrice: 0.1, cachedInputPrice: 0.025, outputPrice: 0.4, maxTokens: 1000000, multimodal: true, color: 'google', retirementDate: '2026-06-01', replacementId: 'gemini-3.5-flash', description: 'Endpoint Gemini 2.0 arrêté' }),
  oldGoogle({ id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash-Lite', provider: 'Google', inputPrice: 0.075, outputPrice: 0.3, maxTokens: 1000000, multimodal: true, color: 'google', retirementDate: '2026-06-01', replacementId: 'gemini-3.1-flash-lite', description: 'Endpoint Gemini 2.0 Flash-Lite arrêté' }),
  oldGoogle({ id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', inputPrice: 1.25, cachedInputPrice: 0.3125, outputPrice: 5, longContextThreshold: 128001, longContextInputPrice: 2.5, longContextOutputPrice: 10, maxTokens: 2000000, multimodal: true, color: 'google', replacementId: 'gemini-2.5-pro', description: 'Ancienne génération Gemini Pro' }),
  oldGoogle({ id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', inputPrice: 0.075, cachedInputPrice: 0.01875, outputPrice: 0.3, longContextThreshold: 128001, longContextInputPrice: 0.15, longContextOutputPrice: 0.6, maxTokens: 1000000, multimodal: true, color: 'google', replacementId: 'gemini-2.5-flash', description: 'Ancienne génération Gemini Flash' }),
  oldGoogle({ id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B', provider: 'Google', inputPrice: 0.0375, cachedInputPrice: 0.01, outputPrice: 0.15, longContextThreshold: 128001, longContextInputPrice: 0.075, longContextOutputPrice: 0.3, maxTokens: 1000000, multimodal: true, color: 'google', replacementId: 'gemini-2.5-flash-lite', description: 'Ancienne variante compacte Gemini Flash' }),

  // DeepSeek — derniers tarifs publics avant V4.
  oldDeepSeek({ id: 'deepseek-chat-v3', name: 'DeepSeek V3', provider: 'DeepSeek', inputPrice: 0.27, cachedInputPrice: 0.07, outputPrice: 1.1, maxTokens: 64000, color: 'deepseek', replacementId: 'deepseek-v4-flash', description: 'Ancien modèle non-thinking servi via deepseek-chat' }),
  oldDeepSeek({ id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', inputPrice: 0.55, cachedInputPrice: 0.14, outputPrice: 2.19, maxTokens: 64000, color: 'deepseek', replacementId: 'deepseek-v4-flash', description: 'Ancien modèle de raisonnement servi via deepseek-reasoner' }),

  // Mistral — dernier tarif public connu avant dépréciation/retrait.
  oldMistral({ id: 'mistral-medium-2508', name: 'Mistral Medium 3.1', provider: 'Mistral', inputPrice: 0.4, outputPrice: 2, maxTokens: 128000, multimodal: true, color: 'mistral', replacementId: 'mistral-medium-latest', description: 'Ancienne génération Mistral Medium' }),
  oldMistral({ id: 'mistral-small-2506', name: 'Mistral Small 3.2', provider: 'Mistral', inputPrice: 0.1, outputPrice: 0.3, maxTokens: 128000, multimodal: true, color: 'mistral', replacementId: 'mistral-small-latest', description: 'Ancienne génération Mistral Small' }),
  oldMistral({ id: 'devstral-2512', name: 'Devstral 2', provider: 'Mistral', inputPrice: 0.4, outputPrice: 2, maxTokens: 256000, color: 'mistral', replacementId: 'mistral-medium-latest', description: 'Ancien modèle agentique pour le code' }),
  oldMistral({ id: 'labs-devstral-small-2512', name: 'Devstral Small 2', provider: 'Mistral', inputPrice: 0.1, outputPrice: 0.3, maxTokens: 256000, color: 'mistral', replacementId: 'mistral-small-latest', description: 'Ancien petit modèle agentique pour le code' }),
  oldMistral({ id: 'magistral-medium-2509', name: 'Magistral Medium 1.2', provider: 'Mistral', inputPrice: 2, outputPrice: 5, maxTokens: 128000, multimodal: true, color: 'mistral', replacementId: 'mistral-medium-latest', description: 'Ancien modèle de raisonnement Mistral' }),
  oldMistral({ id: 'magistral-small-2509', name: 'Magistral Small 1.2', provider: 'Mistral', inputPrice: 0.5, outputPrice: 1.5, maxTokens: 128000, multimodal: true, color: 'mistral', replacementId: 'mistral-small-latest', description: 'Ancien petit modèle de raisonnement Mistral' }),
  oldMistral({ id: 'pixtral-large-2411', name: 'Pixtral Large', provider: 'Mistral', inputPrice: 2, outputPrice: 6, maxTokens: 128000, multimodal: true, color: 'mistral', replacementId: 'mistral-medium-latest', description: 'Ancien grand modèle multimodal Pixtral' }),
  oldMistral({ id: 'mistral-large-2411', name: 'Mistral Large 2.1', provider: 'Mistral', inputPrice: 2, outputPrice: 6, maxTokens: 128000, color: 'mistral', replacementId: 'mistral-large-latest', description: 'Ancienne génération Mistral Large' }),
  oldMistral({ id: 'open-mistral-nemo-2407', name: 'Mistral Nemo 12B', provider: 'Mistral', inputPrice: 0.15, outputPrice: 0.15, maxTokens: 128000, color: 'mistral', replacementId: 'ministral-14b-latest', description: 'Ancien modèle open-weight multilingue' }),
  oldMistral({ id: 'open-mixtral-8x22b', name: 'Mixtral 8x22B', provider: 'Mistral', inputPrice: 2, outputPrice: 6, maxTokens: 65536, color: 'mistral', replacementId: 'mistral-large-latest', description: 'Ancien modèle MoE open-weight' }),
  oldMistral({ id: 'open-mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'Mistral', inputPrice: 0.7, outputPrice: 0.7, maxTokens: 32768, color: 'mistral', replacementId: 'mistral-small-latest', description: 'Ancien modèle MoE open-weight' }),
];
