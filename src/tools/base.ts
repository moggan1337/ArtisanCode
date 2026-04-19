export interface ToolResult {
  success: boolean;
  output?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

export abstract class BaseTool {
  abstract name: string;
  abstract description: string;
  
  abstract execute(params: any, context: ToolContext): Promise<ToolResult>;
  
  getDefinition(): ToolDefinition {
    return {
      name: this.name,
      description: this.description
    };
  }
}

export interface ToolContext {
  cwd: string;
  env: Record<string, string>;
}
