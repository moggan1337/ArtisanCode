import { BaseTool, ToolResult, ToolContext } from './base.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class GrepTool extends BaseTool {
  name = 'grep';
  description = 'Search for text within files';
  
  async execute(params: {
    pattern: string;
    path?: string;
    caseSensitive?: boolean;
    files?: string[];
  }, context: ToolContext): Promise<ToolResult> {
    try {
      const searchPath = params.path || context.cwd;
      const matches: string[] = [];
      
      const files = params.files || await this.getFiles(searchPath);
      
      for (const file of files) {
        try {
          const content = await fs.readFile(file, 'utf-8');
          const lines = content.split('\n');
          
          const regex = new RegExp(params.pattern, params.caseSensitive ? 'g' : 'gi');
          
          lines.forEach((line, i) => {
            if (regex.test(line)) {
              matches.push(`${file}:${i + 1}: ${line.trim()}`);
            }
          });
        } catch {
          // Skip binary files
        }
      }
      
      return { success: true, output: matches.join('\n') || 'No matches found' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  private async getFiles(dir: string, files: string[] = []): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        await this.getFiles(fullPath, files);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
}
