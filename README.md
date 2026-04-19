# ArtisanCode

> 🎨 Open-source AI coding assistant - Claude Code alternative

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)](package.json)
[![Stars](https://img.shields.io/github/stars/moggan1337/ArtisanCode)](https://github.com/moggan1337/ArtisanCode/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/moggan1337/ArtisanCode)](https://github.com/moggan1337/ArtisanCode/commits)

## 🚀 Overview

ArtisanCode is an open-source, self-hostable AI coding assistant that helps developers write better code faster. Built as a modern alternative to proprietary solutions, it emphasizes privacy, flexibility, and extensibility.

### Key Benefits

- 🔒 **Privacy-First** - Your code stays on your machine
- 🤖 **Multi-Model** - Use any LLM provider (Anthropic, OpenAI, MiniMax, Ollama)
- 🔌 **Extensible** - Plugin system for custom commands and integrations
- 🛠️ **Tool-Rich** - Built-in tools for file operations, terminal commands, web access
- 📦 **MCP Ready** - Model Context Protocol support for external tools

## ✨ Features

### Multi-Provider Support

Connect to your preferred LLM provider:

| Provider | Models | Status |
|----------|--------|--------|
| Anthropic | Claude 3.5 Sonnet, Opus, Haiku | ✅ |
| OpenAI | GPT-4 Turbo, GPT-4, GPT-3.5 | ✅ |
| MiniMax | M2.7, M2.5, M2.1, M2 | ✅ |
| Ollama | Llama 3, Mistral, CodeLlama | ✅ |
| Custom | Any OpenAI-compatible API | ✅ |

### Built-in Tools

| Tool | Description |
|------|-------------|
| `bash` | Execute terminal commands |
| `edit` | Read, write, delete files |
| `glob` | Find files matching patterns |
| `grep` | Search text within files |
| `web_fetch` | Fetch content from URLs |

### MCP Integration

ArtisanCode supports the Model Context Protocol for extended tooling:

```bash
# Add MCP servers via config
artisancode chat --mcp-config ./mcp-config.json
```

Supported MCP servers:
- Filesystem access
- Git integration
- GitHub API
- Browser automation (Playwright)
- Database tools
- And more...

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API key for your preferred LLM provider

### Quick Start

```bash
# Clone the repository
git clone https://github.com/moggan1337/ArtisanCode.git
cd ArtisanCode

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link

# Start chatting
npm run dev
```

### Using npm link

```bash
npm link

# Now you can use globally
artisancode chat
artisancode doctor
artisancode review ./src
```

## 💻 Usage

### Interactive Chat

Start a conversation with ArtisanCode:

```bash
artisancode chat
```

With options:

```bash
# Use specific provider
artisancode chat --provider anthropic --model claude-sonnet-4-20250514

# Use MiniMax
artisancode chat --provider minimax --model MiniMax-M2.7-highspeed

# Use local Ollama
artisancode chat --provider ollama --model llama3 --base-url http://localhost:11434
```

### Code Review

Review code in a file or directory:

```bash
artisancode review ./src
artisancode review ./src/components/Button.tsx
```

### Check Setup

Verify your environment:

```bash
artisancode doctor
```

### Initialize Configuration

Create a project configuration:

```bash
artisancode init
```

## ⚙️ Configuration

### Configuration File

Create `.artisancode.json` in your project root:

```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "apiKey": "your-api-key",
  "temperature": 0.7,
  "maxTokens": 4096,
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./workspace"]
    }
  }
}
```

### Environment Variables

```bash
# Set API keys
export ANTHROPIC_API_KEY=your-key
export OPENAI_API_KEY=your-key
export MINIMAX_API_KEY=your-key

# Optional configuration
export ARTISAN_TEMPERATURE=0.7
export ARTISAN_MAX_TOKENS=4096
```

### Provider Configuration

#### Anthropic

```bash
artisancode chat --provider anthropic \
  --model claude-opus-4-20250514 \
  --api-key sk-ant-...
```

#### OpenAI

```bash
artisancode chat --provider openai \
  --model gpt-4-turbo \
  --api-key sk-...
```

#### MiniMax

```bash
artisancode chat --provider minimax \
  --model MiniMax-M2.7-highspeed \
  --api-key sk-... \
  --base-url https://api.minimax.io/anthropic
```

#### Ollama (Local)

```bash
artisancode chat --provider ollama \
  --model llama3 \
  --base-url http://localhost:11434
```

## 🧩 Plugin Development

ArtisanCode has an extensible plugin system.

### Creating a Plugin

```javascript
// plugins/my-plugin/plugin.json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "main": "index.js",
  "description": "My custom plugin"
}

// plugins/my-plugin/index.js
export default {
  name: 'my-plugin',
  version: '1.0.0',
  
  onLoad() {
    console.log('Plugin loaded!');
  },
  
  tools: [
    {
      name: 'my-tool',
      description: 'Does something useful',
      execute: async (params) => {
        return { success: true, output: 'Done!' };
      }
    }
  ]
};
```

### Plugin Structure

```
plugins/
└── my-plugin/
    ├── plugin.json      # Plugin manifest
    ├── index.js        # Main entry
    ├── tools/           # Custom tools
    ├── commands/        # Custom commands
    └── hooks/           # Event hooks
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

### Core Components

| Component | Purpose |
|-----------|---------|
| `ArtisanAgent` | Main agent orchestrator |
| `ProviderManager` | LLM provider abstraction |
| `ToolManager` | Tool registration and execution |
| `PluginManager` | Plugin loading and lifecycle |
| `MCPClient` | External tool integration |

## 🔧 Development

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

### Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Keep commits atomic

## 📋 Roadmap

- [ ] Streaming response support
- [ ] WebUI dashboard
- [ ] Git integration improvements
- [ ] More built-in tools
- [ ] VS Code extension
- [ ] JetBrains IDE plugin
- [ ] Team collaboration features
- [ ] Web-based playground

## 🐛 Troubleshooting

### Common Issues

**Q: API key not working**
```bash
artisancode doctor
```

**Q: Provider not responding**
- Check your API key is correct
- Verify network connectivity
- Check provider status pages

**Q: Tool execution fails**
- Ensure proper permissions
- Check working directory access
- Review tool-specific requirements

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Inspired by Claude Code and Anthropic's work
- Built with TypeScript + Node.js
- Uses Model Context Protocol for tool integrations
- Thanks to all contributors

## 🔗 Related Projects

- [SwarmCoder](https://github.com/moggan1337/SwarmCoder) - Multi-agent swarm for code generation

---

<p align="center">
  Built with ❤️ for the developer community<br>
  <a href="https://github.com/moggan1337">@moggan1337</a>
</p>
