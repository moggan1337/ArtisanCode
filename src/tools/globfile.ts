import { BaseTool, ToolResult, ToolContext } from './base.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class SearchTool extends BaseTool {
  name = 'glob';
  description = 'Find files matching a pattern';
  
  async execute(params: { 
    pattern: string;
    cwd?: string;
  }, context: ToolContext): Promise<ToolResult> {
    try {
      const searchDir = params.cwd || context.cwd;
      const matches = await this.glob(searchDir, params.pattern);
      return { success: true, output: matches.join('\n') };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  private async glob(dir: string, pattern: string): Promise<string[]> {
    const results: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        const regex = new RegExp(
          '^' + pattern
            .replace(/\./g, '\\.')
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*') + '$'
        );
        
        if (regex.test(entry.name)) {
          results.push(fullPath);
        }
        
        if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          const subResults = await this.glob(fullPath, pattern);
          results.push(...subResults);
        }
      }
    } catch {
      // Skip inaccessible directories
    }
    
    return results;
  }
}
