# ArtisanCode

> 🎨 Open-source AI coding assistant - Claude Code alternative

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)](package.json)
[![Stars](https://img.shields.io/github/stars/moggan1337/ArtisanCode)](https://github.com/moggan1337/ArtisanCode/stargazers)

## 🎯 Overview

ArtisanCode is an open-source, self-hostable AI coding assistant that helps developers write better code faster. Like Claude Code, it understands your codebase, executes routine tasks, and helps with debugging - all through natural language commands.

## ✨ Features

- 🤖 **Multi-Model Support** - Works with any LLM provider (Anthropic, OpenAI, MiniMax, Ollama)
- 🔌 **Extensible Plugin System** - Add custom commands, skills, and integrations
- 🖥️ **Full Terminal Integration** - Executes commands, manages files, handles git workflows
- 🎨 **Built-in Tools** - Bash, file editing, search, grep, web fetch
- 🔒 **Privacy-First** - Self-host locally, your code stays on your machine
- 📦 **MCP Compatible** - Model Context Protocol support for external tools
- 🛠️ **Plugin Architecture** - Extend functionality with custom plugins

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/moggan1337/ArtisanCode.git
cd ArtisanCode

# Install dependencies
npm install

# Start chatting
npm run dev

# Or use CLI commands
npx artisancode chat --provider anthropic
npx artisancode doctor
```

## 📦 Installation

### From Source

```bash
git clone https://github.com/moggan1337/ArtisanCode.git
cd ArtisanCode
npm install
npm run build
npm link
```

### Global Usage

```bash
# After npm link
artisancode chat

# Or use npx
npx artisancode chat --provider minimax
```

## 🔧 Configuration

Create a `.artisancode.json` in your project root:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "apiKey": "your-api-key-here",
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}
```

### Environment Variables

```bash
export ANTHROPIC_API_KEY=your-key
export OPENAI_API_KEY=your-key
export MINIMAX_API_KEY=your-key
```

## 💬 Usage

### Interactive Chat

```bash
artisancode chat
```

Options:
```bash
artisancode chat --provider anthropic --model claude-sonnet-4-20250514
artisancode chat --provider minimax --model MiniMax-M2.7-highspeed
artisancode chat --provider ollama --model llama3
```

### Code Review

```bash
artisancode review ./src
```

### Check Setup

```bash
artisancode doctor
```

## 🔌 Providers

### Anthropic (Default)

```bash
artisancode chat --provider anthropic --model claude-opus-4-20250514
```

### OpenAI

```bash
artisancode chat --provider openai --model gpt-4-turbo
```

### MiniMax

```bash
artisancode chat --provider minimax --model MiniMax-M2.7-highspeed
```

### Ollama (Local)

```bash
artisancode chat --provider ollama --model llama3 --base-url http://localhost:11434
```

## 🛠️ Built-in Tools

| Tool | Description |
|------|-------------|
| `bash` | Execute terminal commands |
| `edit` | Read, write, delete files |
| `glob` | Find files matching patterns |
| `grep` | Search text within files |
| `web_fetch` | Fetch content from URLs |

## 📦 MCP Integration

ArtisanCode supports the Model Context Protocol for extended tooling:

```bash
# Add MCP server to .artisancode.json
artisancode chat --mcp-config ./mcp-config.json
```

Example MCP config:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/workspace"]
    },
    "github": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}
```

## 🧩 Plugin Development

Create a plugin at `./plugins/my-plugin/`:

```javascript
// plugin.json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "main": "index.js"
}

// index.js
export default {
  name: 'my-plugin',
  version: '1.0.0',
  
  async onLoad() {
    console.log('Plugin loaded!');
  },
  
  tools: [
    {
      name: 'my-tool',
      description: 'Does something cool',
      execute: async (params) => {
        return { success: true, output: 'Done!' };
      }
    }
  ]
};
```

## 🏗️ Architecture

```
ArtisanCode/
├── src/
│   ├── cli/           # Command-line interface
│   ├── core/          # Core agent logic
│   ├── tools/         # Built-in tools
│   ├── providers/     # LLM provider integrations
│   ├── plugins/       # Plugin system
│   ├── mcp/          # Model Context Protocol
│   └── utils/         # Utilities
├── config/           # Configuration files
├── plugins/          # Custom plugins (user)
├── docs/            # Documentation
└── tests/           # Test suites
```

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a PR

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

**Daniel Ideborn**
- GitHub: [@danielaideborn](https://github.com/danielaideborn)

## 🙏 Acknowledgments

- Inspired by Claude Code and Anthropic's work
- Built with TypeScript + Node.js
- Uses Model Context Protocol for tool integrations

---

*Built with ❤️ for the developer community*
