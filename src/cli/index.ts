#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { ArtisanAgent } from '../core/agent.js';
import * as fs from 'fs/promises';
import * as path from 'path';

const program = new Command();

program
  .name('artisancode')
  .description('🎨 Open-source AI coding assistant')
  .version('0.1.0');

// Chat command
program
  .command('chat')
  .description('Start interactive chat session')
  .option('-m, --model <model>', 'LLM model to use')
  .option('-p, --provider <provider>', 'LLM provider (anthropic, openai, minimax, ollama)', 'anthropic')
  .option('-k, --api-key <key>', 'API key for the provider')
  .option('-b, --base-url <url>', 'Base URL for custom providers')
  .option('--mcp-config <path>', 'Path to MCP configuration file')
  .action(async (options) => {
    console.log(chalk.blue(`
╔════════════════════════════════════════════════════╗
║          🎨 ArtisanCode - AI Coding Assistant     ║
╚════════════════════════════════════════════════════╝
`));
    
    const agent = new ArtisanAgent({
      provider: options.provider,
      model: options.model,
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      mcpConfig: options.mcpConfig
    });
    
    await agent.startChat();
  });

// Review command
program
  .command('review')
  .description('Review code in a file or directory')
  .argument('<path>', 'Path to review')
  .option('-p, --provider <provider>', 'LLM provider', 'anthropic')
  .option('-k, --api-key <key>', 'API key')
  .action(async (pathArg, options) => {
    const agent = new ArtisanAgent({
      provider: options.provider,
      apiKey: options.apiKey
    });
    
    await agent.reviewCode(pathArg);
  });

// Init command - create config file
program
  .command('init')
  .description('Initialize ArtisanCode configuration')
  .action(async () => {
    const configPath = path.join(process.cwd(), '.artisancode.json');
    
    const defaultConfig = {
      provider: "anthropic",
      model: "claude-sonnet-4-20250514",
      apiKey: process.env.ANTHROPIC_API_KEY || "",
      mcpServers: {}
    };
    
    await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log(chalk.green(`✅ Configuration created at ${configPath}`));
  });

// Doctor command - check setup
program
  .command('doctor')
  .description('Check ArtisanCode setup')
  .action(async () => {
    console.log(chalk.blue('\n🔍 Checking setup...\n'));
    
    // Check Node.js
    console.log(`Node.js: ${process.version}`);
    
    // Check for API keys
    const apiKeys = {
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      MINIMAX_API_KEY: !!process.env.MINIMAX_API_KEY
    };
    
    console.log('\nAPI Keys:');
    for (const [key, exists] of Object.entries(apiKeys)) {
      console.log(`  ${key}: ${exists ? chalk.green('✓ set') : chalk.yellow('✗ not set')}`);
    }
    
    console.log(chalk.green('\n✅ Setup check complete\n'));
  });

program.parse();
