import chalk from 'chalk';
import * as readline from 'readline';
import { ProviderManager, Message, ProviderConfig } from '../providers/index.js';
import { ToolManager, ToolContext } from '../tools/index.js';
import { MCPClient } from '../mcp/index.js';

export interface AgentConfig {
  provider?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  tools?: string[];
  mcpConfig?: string;
}

export class ArtisanAgent {
  private config: AgentConfig;
  private providerManager: ProviderManager;
  private toolManager: ToolManager;
  private mcpClient: MCPClient | null = null;
  private messages: Message[] = [];
  private context: ToolContext;
  
  constructor(config: AgentConfig = {}) {
    this.config = {
      provider: config.provider || 'anthropic',
      model: config.model || 'claude-sonnet-4-20250514',
      ...config
    };
    
    this.providerManager = new ProviderManager();
    this.toolManager = new ToolManager();
    this.context = {
      cwd: process.cwd(),
      env: process.env as Record<string, string>
    };
    
    // Add system prompt
    this.messages.push({
      role: 'system',
      content: `You are ArtisanCode, an expert AI coding assistant.

You help users by:
- Writing, reviewing, and debugging code
- Executing terminal commands
- Searching and editing files
- Understanding codebases
- Explaining complex concepts

You have access to tools. Use them when appropriate.
Be concise, helpful, and think step by step.`
    });
  }
  
  async initialize(): Promise<void> {
    console.log(chalk.blue('🎨 ArtisanCode initializing...\n'));
    
    // Initialize MCP if configured
    if (this.config.mcpConfig) {
      try {
        this.mcpClient = new MCPClient();
        await this.mcpClient.addServerFromConfig(this.config.mcpConfig);
        await this.mcpClient.initialize();
        console.log(chalk.green('✅ MCP initialized'));
      } catch (error) {
        console.log(chalk.yellow('⚠️ MCP initialization failed, continuing without MCP'));
      }
    }
    
    // Log available tools
    const tools = this.toolManager.list();
    console.log(chalk.green(`✅ ${tools.length} tools available`));
    
    for (const tool of tools) {
      console.log(chalk.gray(`   - ${tool.name}: ${tool.description}`));
    }
    
    console.log(chalk.green('\n✅ ArtisanCode ready!\n'));
  }
  
  async startChat(): Promise<void> {
    await this.initialize();
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const prompt = () => {
      rl.question(chalk.cyan('You: '), async (input) => {
        if (input.toLowerCase() === 'exit') {
          console.log(chalk.blue('\n👋 Goodbye!'));
          rl.close();
          return;
        }
        
        if (input.toLowerCase() === 'clear') {
          this.messages = this.messages.filter(m => m.role === 'system');
          console.log(chalk.gray('Conversation cleared.\n'));
          prompt();
          return;
        }
        
        if (input.trim()) {
          await this.processMessage(input);
        }
        prompt();
      });
    };
    
    prompt();
  }
  
  async processMessage(input: string): Promise<void> {
    this.messages.push({ role: 'user', content: input });
    
    try {
      // Build tools for LLM
      const availableTools = this.toolManager.list();
      
      // Call LLM
      const response = await this.callLLM(this.messages, availableTools);
      
      this.messages.push({ role: 'assistant', content: response.content });
      
      console.log(chalk.green('\nArtisanCode: ') + response.content + '\n');
      
      // Check for tool use
      if (response.content.includes('{{TOOL:')) {
        await this.handleToolUse(response.content);
      }
      
    } catch (error: any) {
      console.log(chalk.red('\n❌ Error: ') + error.message);
    }
  }
  
  private async callLLM(messages: Message[], tools: any[]): Promise<any> {
    const provider = this.providerManager.get(this.config.provider!, {
      apiKey: this.config.apiKey || process.env.ANTHROPIC_API_KEY,
      model: this.config.model,
      baseUrl: this.config.baseUrl
    } as ProviderConfig);
    
    return provider.chat(messages);
  }
  
  private async handleToolUse(response: string): Promise<void> {
    // Parse tool calls from response
    const toolRegex = /\{\{TOOL:(\w+)\s+(.*?)\}\}/g;
    let match;
    
    while ((match = toolRegex.exec(response)) !== null) {
      const toolName = match[1];
      const toolArgs = JSON.parse(match[2]);
      
      console.log(chalk.yellow(`\n🔧 Using tool: ${toolName}`));
      
      const result = await this.toolManager.execute(toolName, toolArgs, this.context);
      
      if (result.success) {
        console.log(chalk.gray(`\n📤 Output:\n${result.output}\n`));
        this.messages.push({
          role: 'user',
          content: `Tool ${toolName} result: ${result.output}`
        });
      } else {
        console.log(chalk.red(`\n❌ Error: ${result.error}\n`));
        this.messages.push({
          role: 'user',
          content: `Tool ${toolName} failed: ${result.error}`
        });
      }
    }
  }
  
  async reviewCode(path: string): Promise<void> {
    await this.initialize();
    
    console.log(chalk.blue(`\n🔍 Reviewing: ${path}\n`));
    
    // Read files
    const editTool = this.toolManager.get('edit');
    if (!editTool) {
      console.log(chalk.red('Edit tool not available'));
      return;
    }
    
    const result = await editTool.execute({
      action: 'read',
      path
    }, this.context);
    
    if (!result.success) {
      console.log(chalk.red(`❌ Failed to read: ${result.error}`));
      return;
    }
    
    // Send to LLM for review
    this.messages.push({
      role: 'user',
      content: `Review this code and provide feedback:\n\n${result.output}`
    });
    
    try {
      const response = await this.callLLM(this.messages, []);
      console.log(chalk.green('\n📝 Code Review:\n'));
      console.log(response.content);
    } catch (error: any) {
      console.log(chalk.red('\n❌ Review failed: ') + error.message);
    }
  }
}
