#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { ArtisanAgent } from '../core/agent.js';

const program = new Command();

program
  .name('artisancode')
  .description('Open-source AI coding assistant')
  .version('0.1.0');

program
  .command('chat')
  .description('Start interactive chat session')
  .option('-m, --model <model>', 'LLM model to use', 'claude-sonnet-4-20250514')
  .option('-p, --provider <provider>', 'LLM provider (openai, anthropic, minimax)', 'anthropic')
  .action(async (options) => {
    console.log(chalk.blue('🎨 ArtisanCode - AI Coding Assistant'));
    console.log(chalk.gray('Type "exit" to quit\n'));
    
    const agent = new ArtisanAgent({
      provider: options.provider,
      model: options.model
    });
    
    await agent.startChat();
  });

program
  .command('review')
  .description('Review code in current directory')
  .argument('<path>', 'Path to review')
  .action(async (path) => {
    console.log(chalk.blue(`🔍 Reviewing: ${path}`));
    const agent = new ArtisanAgent({});
    await agent.reviewCode(path);
  });

program.parse();
