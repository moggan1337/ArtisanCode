import { BaseProvider, Message, LLMResponse, ProviderConfig } from './base.js';

export class OpenAIProvider extends BaseProvider {
  name = 'openai';
  
  private baseUrl = 'https://api.openai.com/v1/chat/completions';
  
  async chat(messages: Message[], options?: Partial<ProviderConfig>): Promise<LLMResponse> {
    const opts = { ...this.getDefaultOptions(), ...this.config, ...options };
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${opts.apiKey}`
      },
      body: JSON.stringify({
        model: opts.model || 'gpt-4-turbo',
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
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }
    
    const data: any = await response.json();
    
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: {
        inputTokens: data.usage?.prompt_tokens || 0,
        outputTokens: data.usage?.completion_tokens || 0
      },
      model: opts.model || 'gpt-4-turbo'
    };
  }
}
