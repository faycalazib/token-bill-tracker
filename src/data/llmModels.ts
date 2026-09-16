import { LLMModel } from '@/types/llm';
import { CURRENT_TOKEN_MODELS } from '@/data/currentTokenModels';
import { LEGACY_TOKEN_MODELS } from '@/data/legacyTokenModels';

const MEDIA_MODELS: LLMModel[] = [
  // ═══════════════════════════════════════════════════════════════════
  // 🎨 Image Generation Models
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'dall-e-3',
    name: 'DALL·E 3',
    provider: 'OpenAI',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.040,    // $0.040 par image (1024x1024)
    outputPrice: 0,
    maxTokens: 0,
    color: 'openai',
    description: 'Génération d\'images HD depuis texte — $0.04/image (1024×1024)'
  },
  {
    id: 'dall-e-3-hd',
    name: 'DALL·E 3 HD',
    provider: 'OpenAI',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.080,    // $0.080 par image HD (1024x1792)
    outputPrice: 0,
    maxTokens: 0,
    color: 'openai',
    description: 'Qualité HD, idéal marketing — $0.08/image (1024×1792)'
  },
  {
    id: 'gpt-image-1',
    name: 'GPT Image 1',
    provider: 'OpenAI',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.040,
    outputPrice: 0,
    maxTokens: 0,
    color: 'openai',
    description: 'Nouveau modèle natif image d\'OpenAI — $0.04/image'
  },
  {
    id: 'stable-diffusion-3.5-large',
    name: 'Stable Diffusion 3.5 Large',
    provider: 'Stability AI',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.065,    // $0.065 par image
    outputPrice: 0,
    maxTokens: 0,
    color: 'stability',
    description: 'Open source leader — haute qualité, styles variés'
  },
  {
    id: 'stable-diffusion-3.5-medium',
    name: 'Stable Diffusion 3.5 Medium',
    provider: 'Stability AI',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.035,
    outputPrice: 0,
    maxTokens: 0,
    color: 'stability',
    description: 'Version optimisée, bon rapport qualité/coût'
  },
  {
    id: 'flux-1.1-pro',
    name: 'FLUX 1.1 Pro',
    provider: 'Black Forest Labs',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.040,
    outputPrice: 0,
    maxTokens: 0,
    color: 'flux',
    description: 'Qualité Midjourney en API — très populaire en SaaS'
  },
  {
    id: 'flux-1-schnell',
    name: 'FLUX.1 Schnell',
    provider: 'Black Forest Labs',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.003,
    outputPrice: 0,
    maxTokens: 0,
    color: 'flux',
    description: 'Ultra-rapide et économique — $0.003/image'
  },
  {
    id: 'imagen-3',
    name: 'Imagen 3',
    provider: 'Google',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.040,
    outputPrice: 0,
    maxTokens: 0,
    color: 'google',
    description: 'Génération d\'images Google — qualité photorealistic'
  },
  {
    id: 'titan-image-gen-2',
    name: 'Titan Image Generator v2',
    provider: 'Amazon',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.010,
    outputPrice: 0,
    maxTokens: 0,
    color: 'amazon',
    description: 'Génération d\'images AWS — très économique via Bedrock'
  },
  {
    id: 'ideogram-v2',
    name: 'Ideogram v2',
    provider: 'Ideogram',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.080,
    outputPrice: 0,
    maxTokens: 0,
    color: 'ideogram',
    description: 'Excellent en typographie — texte dans les images'
  },
  {
    id: 'midjourney-v6.1',
    name: 'Midjourney v6.1',
    provider: 'Midjourney',
    type: 'image',
    pricingUnit: 'images',
    inputPrice: 0.050,
    outputPrice: 0,
    maxTokens: 0,
    color: 'midjourney',
    description: 'Référence esthétique — art, design, mode'
  },

  // ═══════════════════════════════════════════════════════════════════
  // 🔊 Audio & Speech Models
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'whisper-v3',
    name: 'Whisper v3',
    provider: 'OpenAI',
    type: 'audio',
    pricingUnit: 'minutes',
    inputPrice: 0.006,    // $0.006 par minute
    outputPrice: 0,
    maxTokens: 0,
    color: 'openai',
    description: 'STT leader — transcription audio → texte, $0.006/min'
  },
  {
    id: 'openai-tts-1',
    name: 'TTS-1',
    provider: 'OpenAI',
    type: 'audio',
    pricingUnit: 'characters',
    inputPrice: 15,       // $15 par 1M caractères
    outputPrice: 0,
    maxTokens: 0,
    color: 'openai',
    description: 'Text-to-Speech rapide — 6 voix naturelles, $15/1M chars'
  },
  {
    id: 'openai-tts-1-hd',
    name: 'TTS-1 HD',
    provider: 'OpenAI',
    type: 'audio',
    pricingUnit: 'characters',
    inputPrice: 30,       // $30 par 1M caractères
    outputPrice: 0,
    maxTokens: 0,
    color: 'openai',
    description: 'Text-to-Speech haute qualité — $30/1M chars'
  },
  {
    id: 'elevenlabs-turbo-v2.5',
    name: 'ElevenLabs Turbo v2.5',
    provider: 'ElevenLabs',
    type: 'audio',
    pricingUnit: 'characters',
    inputPrice: 18,       // ~$18 par 1M caractères
    outputPrice: 0,
    maxTokens: 0,
    color: 'elevenlabs',
    description: 'TTS le plus réaliste — clonage de voix, émotions'
  },
  {
    id: 'elevenlabs-multilingual-v2',
    name: 'ElevenLabs Multilingual v2',
    provider: 'ElevenLabs',
    type: 'audio',
    pricingUnit: 'characters',
    inputPrice: 24,
    outputPrice: 0,
    maxTokens: 0,
    color: 'elevenlabs',
    description: 'TTS multilingue — 29 langues, voix expressives'
  },
  {
    id: 'google-cloud-tts',
    name: 'Cloud TTS Neural2',
    provider: 'Google',
    type: 'audio',
    pricingUnit: 'characters',
    inputPrice: 16,       // $16 par 1M caractères
    outputPrice: 0,
    maxTokens: 0,
    color: 'google',
    description: 'TTS Google neural — qualité studio, 40+ langues'
  },

  // ═══════════════════════════════════════════════════════════════════
  // 🎬 Video Generation Models
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'sora',
    name: 'Sora',
    provider: 'OpenAI',
    type: 'video',
    pricingUnit: 'seconds',
    inputPrice: 0.15,     // ~$0.15 par seconde de vidéo
    outputPrice: 0,
    maxTokens: 0,
    color: 'openai',
    description: 'Génération vidéo depuis texte — réalisme cinématique'
  },
  {
    id: 'sora-turbo',
    name: 'Sora Turbo',
    provider: 'OpenAI',
    type: 'video',
    pricingUnit: 'seconds',
    inputPrice: 0.06,
    outputPrice: 0,
    maxTokens: 0,
    color: 'openai',
    description: 'Sora rapide — génération vidéo économique'
  },
  {
    id: 'runway-gen3-alpha',
    name: 'Runway Gen-3 Alpha',
    provider: 'Runway',
    type: 'video',
    pricingUnit: 'seconds',
    inputPrice: 0.25,     // ~$0.25 par seconde
    outputPrice: 0,
    maxTokens: 0,
    color: 'runway',
    description: 'Leader vidéo IA — utilisé en production créative'
  },
  {
    id: 'kling-2.0',
    name: 'Kling 2.0',
    provider: 'Kuaishou',
    type: 'video',
    pricingUnit: 'seconds',
    inputPrice: 0.07,
    outputPrice: 0,
    maxTokens: 0,
    color: 'kuaishou',
    description: 'Vidéo IA chinois — très compétitif en qualité/prix'
  },
  {
    id: 'veo-2',
    name: 'Veo 2',
    provider: 'Google',
    type: 'video',
    pricingUnit: 'seconds',
    inputPrice: 0.20,
    outputPrice: 0,
    maxTokens: 0,
    color: 'google',
    description: 'Génération vidéo Google — jusqu\'à 2min, 4K'
  },
  {
    id: 'minimax-video-01',
    name: 'MiniMax Video-01',
    provider: 'MiniMax',
    type: 'video',
    pricingUnit: 'seconds',
    inputPrice: 0.05,
    outputPrice: 0,
    maxTokens: 0,
    color: 'minimax',
    description: 'Alternative économique — bonne qualité, prix bas'
  },
];

// Les prix texte/embedding proviennent du catalogue vérifié. Les médias restent
// isolés ici car leur tarification dépend d'unités différentes (image, minute, seconde).
export const LLM_MODELS: LLMModel[] = [
  ...CURRENT_TOKEN_MODELS,
  ...LEGACY_TOKEN_MODELS,
  ...MEDIA_MODELS,
];

export const SELECTABLE_MODELS = LLM_MODELS.filter(model => model.lifecycle !== 'retired');

export const getModelById = (id: string): LLMModel | undefined => {
  return LLM_MODELS.find(model => model.id === id);
};

export const getModelsByProvider = (provider: string): LLMModel[] => {
  return LLM_MODELS.filter(model => model.provider === provider);
};

export const getProviders = (): string[] => {
  return Array.from(new Set(LLM_MODELS.map(model => model.provider)));
};

export const getModelsByType = (type: string): LLMModel[] => {
  return LLM_MODELS.filter(model => model.type === type);
};

export const getModelTypes = (): string[] => {
  return Array.from(new Set(LLM_MODELS.map(model => model.type)));
};
