import { BaseProvider, Message, LLMResponse, ProviderConfig } from './base.js';

export class MinimaxProvider extends BaseProvider {
  name = 'minimax';
  
  private baseUrl = 'https://api.minimax.io/v1/text/chatcompletion_v2';
  
  async chat(messages: Message[], options?: Partial<ProviderConfig>): Promise<LLMResponse> {
    const opts = { ...this.getDefaultOptions(), ...this.config, ...options };
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${opts.apiKey}`
      },
      body: JSON.stringify({
        model: opts.model || 'MiniMax-M2.7-highspeed',
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        max_tokens: opts.maxTokens,
        temperature: opts.temperature
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Minimax API error: ${response.status} - ${error}`);
    }
    
    const data: any = await response.json();
    
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: {
        inputTokens: data.usage?.prompt_tokens || 0,
        outputTokens: data.usage?.completion_tokens || 0
      },
      model: opts.model || 'MiniMax-M2.7-highspeed'
    };
  }
}
