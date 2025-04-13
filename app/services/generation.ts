import api from './api';

interface PromptData {
  name: string;
  description: string;
  content: string;
  category: string;
  template?: string;
}

interface GenerationParameters {
  temperature: number;
  max_tokens: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ModelOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  capabilities: string[];
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'gemini-2.0-flash',
    label: 'Fast & Precise',
    description: 'Quick responses with high accuracy',
    icon: '⚡',
    capabilities: ['coding', 'general', 'technical']
  },
  {
    id: 'claude-3-opus',
    label: 'Creative & Detailed',
    description: 'Rich, creative responses with deep analysis',
    icon: '🎨',
    capabilities: ['creative', 'research', 'writing']
  },
  {
    id: 'claude-3-sonnet',
    label: 'Research & Analysis',
    description: 'In-depth research and analytical responses',
    icon: '🔍',
    capabilities: ['research', 'analysis', 'academic']
  }
];

export const getModelByCategory = (category: string): string => {
  switch (category) {
    case 'coding':
      return 'gemini-2.0-flash';
    case 'research':
      return 'claude-3-sonnet';
    case 'creative':
      return 'claude-3-opus';
    default:
      return 'gemini-2.0-flash';
  }
};

const getTemperatureByMode = (mode: number): number => {
  switch (mode) {
    case 0: // Precise
      return 0.2;
    case 1: // Balanced
      return 0.7;
    case 2: // Creative
      return 0.9;
    default:
      return 0.7;
  }
};

const getMaxTokensByLength = (length: number): number => {
  switch (length) {
    case 0: // Short
      return 500;
    case 1: // Medium
      return 1000;
    case 2: // Long
      return 2000;
    default:
      return 1000;
  }
};

export const generationService = {
  getModelOptions: () => MODEL_OPTIONS,

  async createGeneration(
    prompt: string, 
    category: string = 'general',
    mode: number = 1,
    length: number = 1,
    selectedModel: string | null = null
  ) {
    const model = selectedModel || getModelByCategory(category);
    const temperature = getTemperatureByMode(mode);
    const max_tokens = getMaxTokensByLength(length);

    const response = await api.post('/generations', {
      prompt,
      model,
      parameters: {
        temperature,
        max_tokens
      }
    });
    return response.data;
  },

  async createChat(
    messages: { role: string; content: string }[],
    mode: number = 1,
    length: number = 1
  ) {
    const temperature = getTemperatureByMode(mode);
    const max_tokens = getMaxTokensByLength(length);

    const response = await api.post('/generations', {
      prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
      model: 'gemini-2.0-flash',
      parameters: {
        temperature,
        max_tokens
      }
    });
    return response.data;
  },

  async getGenerations(page: number = 1, limit: number = 10) {
    const response = await api.get('/generations', {
      params: { page, limit }
    });
    return response.data;
  },

  async getGenerationById(id: string) {
    const response = await api.get(`/generations/${id}`);
    return response.data;
  },

  async createPrompt(promptData: PromptData) {
    const response = await api.post('/prompts', promptData);
    return response.data;
  },

  async generateContent(
    promptId: string,
    category: string = 'general',
    mode: number = 1,
    length: number = 1
  ) {
    const model = getModelByCategory(category);
    const temperature = getTemperatureByMode(mode);
    const max_tokens = getMaxTokensByLength(length);

    const response = await api.post('/generations', {
      prompt: promptId,
      model,
      parameters: {
        temperature,
        max_tokens
      }
    });
    return response.data;
  },

  async getPrompts(page: number = 1, limit: number = 10) {
    const response = await api.get('/prompts', {
      params: { page, limit }
    });
    return response.data;
  },

  async getPromptById(id: string) {
    const response = await api.get(`/prompts/${id}`);
    return response.data;
  }
}; 