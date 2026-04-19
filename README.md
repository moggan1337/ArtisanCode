# ArtisanCode

> Open-source AI coding assistant - Claude Code alternative

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)

## 🎯 Overview

ArtisanCode is an open-source, self-hostable AI coding assistant that helps developers write better code faster. Like Claude Code, it understands your codebase, executes routine tasks, and helps with debugging - all through natural language commands.

## ✨ Features

- 🤖 **Multi-Model Support** - Works with any LLM provider (OpenAI, Anthropic, MiniMax, Ollama, etc.)
- 🔌 **Extensible Plugin System** - Add custom commands, skills, and integrations
- 🖥️ **Full Terminal Integration** - Executes commands, manages files, handles git workflows
- 🎨 **Code Generation** - Produces distinctive, high-quality code (not generic AI slop)
- 🔒 **Privacy-First** - Self-host locally, your code stays on your machine
- 🛠️ **Tool Use** - Browser automation, file operations, API calls, and more
- 📦 **MCP Compatible** - Model Context Protocol support for external tools

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/danielaideborn/ArtisanCode.git
cd ArtisanCode

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## 🏗️ Architecture

```
ArtisanCode/
├── src/
│   ├── cli/           # Command-line interface
│   ├── core/          # Core agent logic
│   ├── tools/         # Built-in tools (bash, edit, search, etc.)
│   ├── providers/     # LLM provider integrations
│   ├── plugins/       # Plugin system
│   └── utils/         # Utilities
├── config/            # Configuration files
├── docs/              # Documentation
└── tests/             # Test suites
```

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit PRs.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

Daniel Ideborn - [@danielaideborn](https://github.com/danielaideborn)

---

*Built with ❤️ for the developer community*
