import { BaseTool, ToolResult, ToolContext } from './base.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class EditTool extends BaseTool {
  name = 'edit';
  description = 'Read, write, or edit files';
  
  async execute(params: { 
    action: 'read' | 'write' | 'delete' | 'exists';
    path: string;
    content?: string;
  }, context: ToolContext): Promise<ToolResult> {
    try {
      const filePath = path.resolve(context.cwd, params.path);
      
      switch (params.action) {
        case 'read': {
          const content = await fs.readFile(filePath, 'utf-8');
          return { success: true, output: content };
        }
        
        case 'write': {
          const dir = path.dirname(filePath);
          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(filePath, params.content || '', 'utf-8');
          return { success: true, output: `Written to ${params.path}` };
        }
        
        case 'delete': {
          await fs.unlink(filePath);
          return { success: true, output: `Deleted ${params.path}` };
        }
        
        case 'exists': {
          try {
            await fs.access(filePath);
            return { success: true, output: 'true' };
          } catch {
            return { success: true, output: 'false' };
          }
        }
        
        default:
          return { success: false, error: `Unknown action: ${params.action}` };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
