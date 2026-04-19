export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  model: string;
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export abstract class BaseProvider {
  protected config: ProviderConfig;
  
  abstract name: string;
  
  constructor(config: ProviderConfig) {
    this.config = config;
  }
  
  abstract chat(messages: Message[], options?: Partial<ProviderConfig>): Promise<LLMResponse>;
  
  protected getDefaultOptions(): ProviderConfig {
    return {
      model: this.config.model || 'gpt-4',
      maxTokens: this.config.maxTokens || 4096,
      temperature: this.config.temperature || 0.7
    };
  }
}
