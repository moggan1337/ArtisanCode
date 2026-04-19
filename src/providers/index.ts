import { BaseProvider, ProviderConfig } from './base.js';
import { MinimaxProvider } from './minimax.js';
import { AnthropicProvider } from './anthropic.js';
import { OpenAIProvider } from './openai.js';
import { OllamaProvider } from './ollama.js';

export { BaseProvider, Message, LLMResponse, ProviderConfig } from './base.js';

export type ProviderFactory = (config: ProviderConfig) => BaseProvider;

export class ProviderManager {
  private providers: Map<string, ProviderFactory> = new Map();
  
  constructor() {
    // Register default providers
    this.providers.set('minimax', (config) => new MinimaxProvider(config));
    this.providers.set('anthropic', (config) => new AnthropicProvider(config));
    this.providers.set('openai', (config) => new OpenAIProvider(config));
    this.providers.set('ollama', (config) => new OllamaProvider(config));
  }
  
  register(name: string, factory: ProviderFactory): void {
    this.providers.set(name, factory);
  }
  
  get(name: string, config: ProviderConfig): BaseProvider {
    const factory = this.providers.get(name);
    if (!factory) {
      throw new Error(`Unknown provider: ${name}. Available: ${[...this.providers.keys()].join(', ')}`);
    }
    return factory(config);
  }
  
  listProviders(): string[] {
    return [...this.providers.keys()];
  }
}

export { MinimaxProvider } from './minimax.js';
export { AnthropicProvider } from './anthropic.js';
export { OpenAIProvider } from './openai.js';
export { OllamaProvider } from './ollama.js';
