import { LLMModel } from '@/types/llm';

export const PRICING_LAST_VERIFIED = '2026-09-13';

export const PRICING_SOURCES = {
  OpenAI: 'https://developers.openai.com/api/docs/pricing',
  Anthropic: 'https://platform.claude.com/docs/en/about-claude/pricing',
  Google: 'https://ai.google.dev/gemini-api/docs/pricing',
  xAI: 'https://docs.x.ai/developers/pricing',
  DeepSeek: 'https://api-docs.deepseek.com/quick_start/pricing',
  Mistral: 'https://mistral.ai/pricing/api/',
  Cohere: 'https://cohere.com/pricing',
  Amazon: 'https://aws.amazon.com/bedrock/pricing/',
  Perplexity: 'https://docs.perplexity.ai/docs/getting-started/pricing',
  Groq: 'https://console.groq.com/docs/models',
  Cerebras: 'https://api.cerebras.ai/public/v1/models',
} as const;

type CurrentModel = Omit<LLMModel, 'type' | 'pricingUnit' | 'sourceUrl' | 'verifiedAt'> & {
  type?: 'text' | 'embedding';
};

const pricedModel = (sourceUrl: string, model: CurrentModel): LLMModel => ({
  type: 'text',
  pricingUnit: 'tokens',
  lifecycle: 'current',
  sourceUrl,
  verifiedAt: PRICING_LAST_VERIFIED,
  ...model,
});

const openAI = (model: CurrentModel) => pricedModel(PRICING_SOURCES.OpenAI, model);
const anthropic = (model: CurrentModel) => pricedModel(PRICING_SOURCES.Anthropic, model);
const google = (model: CurrentModel) => pricedModel(PRICING_SOURCES.Google, model);
const xai = (model: CurrentModel) => pricedModel(PRICING_SOURCES.xAI, model);
const deepSeek = (model: CurrentModel) => pricedModel(PRICING_SOURCES.DeepSeek, model);
const mistral = (model: CurrentModel) => pricedModel(PRICING_SOURCES.Mistral, model);
const cohere = (model: CurrentModel) => pricedModel(PRICING_SOURCES.Cohere, model);
const amazon = (model: CurrentModel) => pricedModel(PRICING_SOURCES.Amazon, model);
const perplexity = (model: CurrentModel) => pricedModel(PRICING_SOURCES.Perplexity, model);
const groq = (model: CurrentModel) => pricedModel(PRICING_SOURCES.Groq, model);
const cerebras = (model: CurrentModel) => pricedModel(PRICING_SOURCES.Cerebras, model);

/**
 * Tarifs publics pay-as-you-go, en USD par million de tokens.
 * Les prix batch, priority/fast, cache write et data residency ne sont pas les prix de base affichés.
 */
export const CURRENT_TOKEN_MODELS: LLMModel[] = [
  // OpenAI — Standard, contexte court. Au-delà de 272k tokens d'entrée : 2x input, 1,5x output.
  openAI({ id: 'gpt-6-astra', name: 'GPT-6 Astra', provider: 'OpenAI', inputPrice: 10, cachedInputPrice: 1, outputPrice: 50, longContextThreshold: 272001, longContextInputPrice: 20, longContextOutputPrice: 75, maxTokens: 1050000, multimodal: true, color: 'openai', description: 'Modèle phare pour les tâches de raisonnement et de code les plus exigeantes' }),
  openAI({ id: 'gpt-5.6-sol', name: 'GPT-5.6 Sol', provider: 'OpenAI', inputPrice: 4, cachedInputPrice: 0.4, outputPrice: 20, longContextThreshold: 272001, longContextInputPrice: 8, longContextOutputPrice: 30, maxTokens: 1050000, multimodal: true, color: 'openai', description: 'Modèle phare pour le travail professionnel complexe' }),
  openAI({ id: 'gpt-5.6-terra', name: 'GPT-5.6 Terra', provider: 'OpenAI', inputPrice: 2, cachedInputPrice: 0.2, outputPrice: 12, longContextThreshold: 272001, longContextInputPrice: 4, longContextOutputPrice: 18, maxTokens: 1050000, multimodal: true, color: 'openai', description: 'Équilibre entre intelligence, latence et coût' }),
  openAI({ id: 'gpt-5.6-luna', name: 'GPT-5.6 Luna', provider: 'OpenAI', inputPrice: 0.2, cachedInputPrice: 0.02, outputPrice: 1.2, longContextThreshold: 272001, longContextInputPrice: 0.4, longContextOutputPrice: 1.8, maxTokens: 1050000, multimodal: true, color: 'openai', description: 'Optimisé pour les volumes élevés et les coûts bas' }),
  openAI({ id: 'text-embedding-3-large', name: 'Text Embedding 3 Large', provider: 'OpenAI', type: 'embedding', inputPrice: 0.13, outputPrice: 0, maxTokens: 8192, color: 'openai', description: 'Embedding texte haute performance' }),
  openAI({ id: 'text-embedding-3-small', name: 'Text Embedding 3 Small', provider: 'OpenAI', type: 'embedding', inputPrice: 0.02, outputPrice: 0, maxTokens: 8192, color: 'openai', description: 'Embedding texte économique' }),

  // Anthropic — Claude API globale.
  anthropic({ id: 'claude-fable-5-1', name: 'Claude Fable 5.1', provider: 'Anthropic', inputPrice: 10, cachedInputPrice: 0.25, outputPrice: 50, maxTokens: 1000000, multimodal: true, color: 'anthropic', description: 'Raisonnement exigeant et agents de très longue durée' }),
  anthropic({ id: 'claude-opus-5', name: 'Claude Opus 5', provider: 'Anthropic', inputPrice: 5, cachedInputPrice: 0.5, outputPrice: 25, maxTokens: 1000000, multimodal: true, color: 'anthropic', description: 'Code agentique complexe et travail d’entreprise' }),
  anthropic({ id: 'claude-sonnet-5', name: 'Claude Sonnet 5', provider: 'Anthropic', inputPrice: 2, cachedInputPrice: 0.2, outputPrice: 10, maxTokens: 1000000, multimodal: true, color: 'anthropic', description: 'Meilleur équilibre vitesse et intelligence de la gamme Claude' }),
  anthropic({ id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5', provider: 'Anthropic', inputPrice: 1, cachedInputPrice: 0.1, outputPrice: 5, maxTokens: 200000, multimodal: true, color: 'anthropic', description: 'Le Claude le plus rapide pour les charges sensibles à la latence' }),

  // Google — Gemini Developer API, Standard. Prix promotionnel de 3.8 Flash jusqu'au 31/12/2026.
  google({ id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', provider: 'Google', inputPrice: 0.75, cachedInputPrice: 0.075, outputPrice: 3.75, maxTokens: 1000000, multimodal: true, color: 'google', pricingNote: 'Tarif promotionnel jusqu’au 31 décembre 2026 ; ensuite $1.50 / $7.50.', description: 'Modèle Flash le plus intelligent pour le code et les agents longue durée' }),
  google({ id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash-Lite', provider: 'Google', inputPrice: 0.3, cachedInputPrice: 0.03, outputPrice: 2.5, maxTokens: 1000000, multimodal: true, color: 'google', description: 'Modèle économique pour traduction et traitements à haut volume' }),
  google({ id: 'gemini-embedding-2', name: 'Gemini Embedding 2', provider: 'Google', type: 'embedding', inputPrice: 0.2, outputPrice: 0, maxTokens: 8192, multimodal: true, color: 'google', pricingNote: 'Prix de l’entrée texte ; image, audio et vidéo ont des tarifs distincts.', description: 'Embedding multimodal unifié pour texte, image, audio et vidéo' }),

  // xAI — Text API, contexte court. Le tarif long contexte s'applique dès 200k tokens.
  xai({ id: 'grok-4.6', name: 'Grok 4.6', provider: 'xAI', inputPrice: 2, cachedInputPrice: 0.5, outputPrice: 6, longContextThreshold: 200000, longContextInputPrice: 4, longContextOutputPrice: 12, maxTokens: 500000, multimodal: true, color: 'xai', description: 'Modèle phare xAI pour le code, les agents et le raisonnement' }),
  xai({ id: 'grok-build-0.1', name: 'Grok Build 0.1', provider: 'xAI', inputPrice: 1, cachedInputPrice: 0.2, outputPrice: 2, longContextThreshold: 200000, longContextInputPrice: 2, longContextOutputPrice: 4, maxTokens: 256000, multimodal: true, color: 'xai', description: 'Modèle économique orienté construction et workflows agentiques' }),
  xai({ id: 'grok-4.5', name: 'Grok 4.5', provider: 'xAI', inputPrice: 2, cachedInputPrice: 0.3, outputPrice: 6, longContextThreshold: 200000, longContextInputPrice: 4, longContextOutputPrice: 12, maxTokens: 500000, multimodal: true, color: 'xai', description: 'Génération précédente à contexte étendu' }),
  xai({ id: 'grok-4.3', name: 'Grok 4.3', provider: 'xAI', inputPrice: 1.25, cachedInputPrice: 0.2, outputPrice: 2.5, longContextThreshold: 200000, longContextInputPrice: 2.5, longContextOutputPrice: 5, maxTokens: 1000000, multimodal: true, color: 'xai', description: 'Modèle généraliste économique avec contexte 1M' }),
  xai({ id: 'grok-4.20-0309-reasoning', name: 'Grok 4.20 Reasoning', provider: 'xAI', inputPrice: 1.25, cachedInputPrice: 0.2, outputPrice: 2.5, longContextThreshold: 200000, longContextInputPrice: 2.5, longContextOutputPrice: 5, maxTokens: 1000000, multimodal: true, color: 'xai', description: 'Variante avec raisonnement de Grok 4.20' }),
  xai({ id: 'grok-4.20-0309-non-reasoning', name: 'Grok 4.20 Non-Reasoning', provider: 'xAI', inputPrice: 1.25, cachedInputPrice: 0.2, outputPrice: 2.5, longContextThreshold: 200000, longContextInputPrice: 2.5, longContextOutputPrice: 5, maxTokens: 1000000, multimodal: true, color: 'xai', description: 'Variante rapide sans raisonnement de Grok 4.20' }),
  xai({ id: 'grok-4.20-multi-agent-0309', name: 'Grok 4.20 Multi-Agent', provider: 'xAI', inputPrice: 1.25, cachedInputPrice: 0.2, outputPrice: 2.5, longContextThreshold: 200000, longContextInputPrice: 2.5, longContextOutputPrice: 5, maxTokens: 1000000, multimodal: true, color: 'xai', description: 'Variante multi-agent de Grok 4.20' }),

  // DeepSeek — cache miss pour le prix d'entrée affiché.
  deepSeek({ id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', provider: 'DeepSeek', inputPrice: 0.44, cachedInputPrice: 0.014, outputPrice: 1.32, maxTokens: 1000000, color: 'deepseek', pricingNote: 'Tarif peak affiché ; les heures off-peak sont facturées à 50 %.', description: 'V4 rapide, modes thinking et non-thinking' }),
  deepSeek({ id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', provider: 'DeepSeek', inputPrice: 1.32, cachedInputPrice: 0.044, outputPrice: 3.96, maxTokens: 1000000, color: 'deepseek', pricingNote: 'Tarif peak affiché ; les heures off-peak sont facturées à 50 %.', description: 'V4 haut de gamme, modes thinking et non-thinking' }),
  deepSeek({ id: 'deepseek-v4-flash-vision-exp', name: 'DeepSeek V4 Flash Vision Exp', provider: 'DeepSeek', inputPrice: 0.44, cachedInputPrice: 0.014, outputPrice: 1.32, maxTokens: 1000000, multimodal: true, color: 'deepseek', pricingNote: 'Tarif peak affiché ; modèle expérimental, heures off-peak à 50 %.', description: 'Variante expérimentale multimodale de V4 Flash' }),

  // Mistral — API Standard.
  mistral({ id: 'mistral-medium-latest', name: 'Mistral Medium 3.5', provider: 'Mistral', inputPrice: 1.5, outputPrice: 7.5, maxTokens: 256000, multimodal: true, color: 'mistral', description: 'Modèle frontier pour agents, code et tâches multimodales' }),
  mistral({ id: 'mistral-small-latest', name: 'Mistral Small 4', provider: 'Mistral', inputPrice: 0.15, outputPrice: 0.6, maxTokens: 256000, multimodal: true, color: 'mistral', description: 'Modèle hybride instruct, raisonnement et code' }),
  mistral({ id: 'mistral-large-latest', name: 'Mistral Large 3', provider: 'Mistral', inputPrice: 0.5, outputPrice: 1.5, maxTokens: 256000, multimodal: true, color: 'mistral', description: 'Grand modèle généraliste multimodal et multilingue' }),
  mistral({ id: 'codestral-latest', name: 'Codestral', provider: 'Mistral', inputPrice: 0.3, outputPrice: 0.9, maxTokens: 128000, color: 'mistral', description: 'Complétion et génération de code à faible latence' }),
  mistral({ id: 'ministral-3b-latest', name: 'Ministral 3 3B', provider: 'Mistral', inputPrice: 0.1, outputPrice: 0.1, maxTokens: 256000, multimodal: true, color: 'mistral', description: 'Petit modèle efficace pour l’edge et les volumes élevés' }),
  mistral({ id: 'ministral-8b-latest', name: 'Ministral 3 8B', provider: 'Mistral', inputPrice: 0.15, outputPrice: 0.15, maxTokens: 256000, multimodal: true, color: 'mistral', description: 'Modèle compact multimodal équilibré' }),
  mistral({ id: 'ministral-14b-latest', name: 'Ministral 3 14B', provider: 'Mistral', inputPrice: 0.2, outputPrice: 0.2, maxTokens: 256000, multimodal: true, color: 'mistral', description: 'Le plus performant de la famille Ministral 3' }),
  mistral({ id: 'mistral-embed', name: 'Mistral Embed', provider: 'Mistral', type: 'embedding', inputPrice: 0.1, outputPrice: 0, maxTokens: 8192, color: 'mistral', description: 'Embedding sémantique de texte' }),
  mistral({ id: 'codestral-embed', name: 'Codestral Embed', provider: 'Mistral', type: 'embedding', inputPrice: 0.15, outputPrice: 0, maxTokens: 8192, color: 'mistral', description: 'Embedding spécialisé pour le code' }),

  // Cohere — seuls les modèles avec tarif public au token comparable sont inclus.
  cohere({ id: 'command-a-03-2025', name: 'Command A', provider: 'Cohere', inputPrice: 2.5, outputPrice: 10, maxTokens: 256000, color: 'cohere', description: 'Modèle d’entreprise pour agents, outils et RAG' }),
  cohere({ id: 'command-r7b-12-2024', name: 'Command R7B', provider: 'Cohere', inputPrice: 0.0375, outputPrice: 0.15, maxTokens: 128000, color: 'cohere', description: 'Petit modèle économique pour RAG et assistants rapides' }),

  // Amazon Nova — Bedrock on-demand.
  amazon({ id: 'amazon.nova-premier-v1:0', name: 'Nova Premier', provider: 'Amazon', inputPrice: 2.5, outputPrice: 12.5, maxTokens: 1000000, multimodal: true, color: 'amazon', description: 'Nova le plus avancé pour les tâches complexes' }),
  amazon({ id: 'amazon.nova-pro-v1:0', name: 'Nova Pro', provider: 'Amazon', inputPrice: 0.8, outputPrice: 3.2, maxTokens: 300000, multimodal: true, color: 'amazon', description: 'Équilibre performance, vitesse et coût sur Bedrock' }),
  amazon({ id: 'amazon.nova-2-lite-v1:0', name: 'Nova 2 Lite', provider: 'Amazon', inputPrice: 0.3, outputPrice: 2.5, maxTokens: 1000000, multimodal: true, color: 'amazon', description: 'Nova 2 économique avec raisonnement et contexte 1M' }),
  amazon({ id: 'amazon.nova-lite-v1:0', name: 'Nova Lite', provider: 'Amazon', inputPrice: 0.06, outputPrice: 0.24, maxTokens: 300000, multimodal: true, color: 'amazon', description: 'Modèle multimodal à bas coût sur Bedrock' }),
  amazon({ id: 'amazon.nova-micro-v1:0', name: 'Nova Micro', provider: 'Amazon', inputPrice: 0.035, outputPrice: 0.14, maxTokens: 128000, color: 'amazon', description: 'Modèle texte Nova à très faible coût et faible latence' }),

  // Perplexity Sonar — frais de requête low-context inclus quand ils s'appliquent.
  perplexity({ id: 'sonar', name: 'Sonar', provider: 'Perplexity', inputPrice: 1, outputPrice: 1, requestPrice: 0.005, maxTokens: 128000, color: 'perplexity', pricingNote: 'Inclut $0.005 par requête en contexte de recherche low (défaut).', description: 'Recherche web rapide avec citations' }),
  perplexity({ id: 'sonar-pro', name: 'Sonar Pro', provider: 'Perplexity', inputPrice: 3, outputPrice: 15, requestPrice: 0.006, maxTokens: 200000, color: 'perplexity', pricingNote: 'Inclut $0.006 par requête en contexte de recherche low.', description: 'Recherche web avancée et réponses détaillées' }),
  perplexity({ id: 'sonar-reasoning-pro', name: 'Sonar Reasoning Pro', provider: 'Perplexity', inputPrice: 2, outputPrice: 8, requestPrice: 0.006, maxTokens: 128000, color: 'perplexity', pricingNote: 'Inclut $0.006 par requête en contexte de recherche low.', description: 'Recherche avec raisonnement multi-étapes' }),
  perplexity({ id: 'sonar-deep-research', name: 'Sonar Deep Research', provider: 'Perplexity', inputPrice: 2, outputPrice: 8, maxTokens: 128000, color: 'perplexity', pricingNote: 'Hors citations ($2/M), raisonnement ($3/M) et recherches ($5/1k), variables par requête.', description: 'Recherche approfondie ; le coût final dépend aussi des citations et recherches' }),
  perplexity({ id: 'pplx-embed-v1-0.6b', name: 'PPLX Embed v1 0.6B', provider: 'Perplexity', type: 'embedding', inputPrice: 0.004, outputPrice: 0, maxTokens: 32768, color: 'perplexity', description: 'Embedding texte compact' }),
  perplexity({ id: 'pplx-embed-v1-4b', name: 'PPLX Embed v1 4B', provider: 'Perplexity', type: 'embedding', inputPrice: 0.03, outputPrice: 0, maxTokens: 32768, color: 'perplexity', description: 'Embedding texte haute qualité' }),
  perplexity({ id: 'pplx-embed-context-v1-0.6b', name: 'PPLX Context Embed v1 0.6B', provider: 'Perplexity', type: 'embedding', inputPrice: 0.008, outputPrice: 0, maxTokens: 32768, color: 'perplexity', description: 'Embedding contextualisé compact' }),
  perplexity({ id: 'pplx-embed-context-v1-4b', name: 'PPLX Context Embed v1 4B', provider: 'Perplexity', type: 'embedding', inputPrice: 0.05, outputPrice: 0, maxTokens: 32768, color: 'perplexity', description: 'Embedding contextualisé haute qualité' }),

  // GroqCloud — modèles publics avec tarif affiché ; les modèles Contact Sales sont exclus.
  groq({ id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B (Groq)', provider: 'Groq', inputPrice: 0.15, outputPrice: 0.6, maxTokens: 131072, color: 'groq', description: 'Modèle open-weight de raisonnement servi par Groq' }),
  groq({ id: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B (Groq)', provider: 'Groq', inputPrice: 0.075, outputPrice: 0.3, maxTokens: 131072, color: 'groq', description: 'Petit GPT-OSS à très haut débit sur Groq' }),
  groq({ id: 'qwen/qwen3.6-27b', name: 'Qwen 3.6 27B (Groq)', provider: 'Groq', inputPrice: 0.6, outputPrice: 3, maxTokens: 131072, color: 'groq', description: 'Qwen 3.6 servi par GroqCloud' }),
  groq({ id: 'qwen/qwen3.8-27b', name: 'Qwen 3.8 27B (Groq)', provider: 'Groq', inputPrice: 0.8, outputPrice: 4, maxTokens: 131042, color: 'groq', description: 'Qwen 3.8 servi par GroqCloud' }),

  // Cerebras — catalogue public retourné par l'API officielle.
  cerebras({ id: 'gpt-oss-120b', name: 'GPT-OSS 120B (Cerebras)', provider: 'Cerebras', inputPrice: 0.35, outputPrice: 0.75, maxTokens: 131072, color: 'cerebras', description: 'GPT-OSS public servi à très haut débit par Cerebras' }),
  cerebras({ id: 'qwen-3.8-27b', name: 'Qwen 3.8 27B (Cerebras)', provider: 'Cerebras', inputPrice: 0.99, outputPrice: 1.49, maxTokens: 65536, multimodal: true, color: 'cerebras', description: 'Qwen multimodal public servi par Cerebras' }),
];
