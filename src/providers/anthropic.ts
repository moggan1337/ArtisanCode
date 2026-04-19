import { BaseProvider, Message, LLMResponse, ProviderConfig } from './base.js';

export class AnthropicProvider extends BaseProvider {
  name = 'anthropic';
  
  private baseUrl = 'https://api.anthropic.com/v1/messages';
  
  async chat(messages: Message[], options?: Partial<ProviderConfig>): Promise<LLMResponse> {
    const opts = { ...this.getDefaultOptions(), ...this.config, ...options };
    
    const systemPrompt = messages.find(m => m.role === 'system');
    const filteredMessages = messages.filter(m => m.role !== 'system');
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': opts.apiKey || '',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: opts.model || 'claude-sonnet-4-20250514',
        max_tokens: opts.maxTokens,
        temperature: opts.temperature,
        system: systemPrompt?.content,
        messages: filteredMessages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }
    
    const data: any = await response.json();
    
    return {
      content: data.content?.[0]?.text || '',
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0
      },
      model: opts.model || 'claude-sonnet-4-20250514'
    };
  }
}
