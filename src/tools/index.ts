import { BaseTool, ToolDefinition, ToolContext, ToolResult } from './base.js';
import { BashTool } from './bash.js';
import { EditTool } from './edit.js';
import { SearchTool } from './globfile.js';
import { GrepTool } from './grep.js';
import { WebFetchTool } from './web.js';

export { BaseTool, ToolDefinition, ToolContext, ToolResult } from './base.js';
export { BashTool } from './bash.js';
export { EditTool } from './edit.js';
export { SearchTool } from './globfile.js';
export { GrepTool } from './grep.js';
export { WebFetchTool } from './web.js';

export class ToolManager {
  private tools: Map<string, BaseTool> = new Map();
  
  constructor() {
    this.register(new BashTool());
    this.register(new EditTool());
    this.register(new SearchTool());
    this.register(new GrepTool());
    this.register(new WebFetchTool());
  }
  
  register(tool: BaseTool): void {
    this.tools.set(tool.name, tool);
  }
  
  get(name: string): BaseTool | undefined {
    return this.tools.get(name);
  }
  
  list(): ToolDefinition[] {
    return [...this.tools.values()].map(t => t.getDefinition());
  }
  
  async execute(name: string, params: any, context: ToolContext): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return { success: false, error: `Unknown tool: ${name}` };
    }
    return tool.execute(params, context);
  }
}
