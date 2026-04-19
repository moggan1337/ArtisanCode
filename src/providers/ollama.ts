import { BaseProvider, Message, LLMResponse, ProviderConfig } from './base.js';

export class OllamaProvider extends BaseProvider {
  name = 'ollama';
  
  private baseUrl: string;
  
  constructor(config: ProviderConfig) {
    super(config);
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
  }
  
  async chat(messages: Message[], options?: Partial<ProviderConfig>): Promise<LLMResponse> {
    const opts = { ...this.getDefaultOptions(), ...this.config, ...options };
    
    const systemPrompt = messages.find(m => m.role === 'system');
    const filteredMessages = messages.filter(m => m.role !== 'system');
    
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: opts.model || 'llama3',
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt.content }] : []),
          ...filteredMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        ],
        options: {
          temperature: opts.temperature,
          num_predict: opts.maxTokens
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${error}`);
    }
    
    const data: any = await response.json();
    
    return {
      content: data.message?.content || '',
      model: opts.model || 'llama3'
    };
  }
}
