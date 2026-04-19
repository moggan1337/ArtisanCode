import { BaseTool, ToolResult, ToolContext } from './base.js';

export class WebFetchTool extends BaseTool {
  name = 'web_fetch';
  description = 'Fetch content from a URL';
  
  async execute(params: { url: string }): Promise<ToolResult> {
    try {
      const response = await fetch(params.url, {
        headers: {
          'User-Agent': 'ArtisanCode/1.0'
        }
      });
      
      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      const content = await response.text();
      
      // Truncate very long responses
      const truncated = content.length > 50000 
        ? content.substring(0, 50000) + '\n... (truncated)'
        : content;
      
      return { success: true, output: truncated };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
