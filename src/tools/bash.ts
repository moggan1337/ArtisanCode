import { BaseTool, ToolResult, ToolContext } from './base.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

export class BashTool extends BaseTool {
  name = 'bash';
  description = 'Execute bash commands in the terminal';
  
  async execute(params: { command: string }, context: ToolContext): Promise<ToolResult> {
    try {
      console.log(chalk.gray(`$ ${params.command}`));
      
      const { stdout, stderr } = await execAsync(params.command, {
        cwd: context.cwd,
        env: context.env,
        timeout: 30000,
        maxBuffer: 10 * 1024 * 1024
      });
      
      let output = stdout;
      if (stderr) {
        output += chalk.yellow(`\nSTDERR:\n${stderr}`);
      }
      
      return {
        success: true,
        output: output || '(no output)',
        metadata: { command: params.command }
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message || String(error),
        metadata: { command: params.command, exitCode: error.code }
      };
    }
  }
}
