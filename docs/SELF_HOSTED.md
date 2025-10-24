# Open Agent Builder - Self-Hosted Guide

## Status: Infrastructure Ready, Integration In Progress

This guide documents the **vision and infrastructure** for running Open Agent Builder without SaaS dependencies. 

**Current Status:**
- ✅ Infrastructure implemented (local storage, optional auth)
- ✅ Firecrawl alternatives documented  
- 🚧 API integration in progress
- 🚧 Component updates in progress

[Track implementation progress →](IMPLEMENTATION_STATUS.md)

## Vision: Running Without External SaaS Dependencies

Open Agent Builder is being designed to run in **fully self-hosted mode** without requiring external SaaS accounts. Here's how it will work:

## Quick Start (Coming Soon)

### 1. Clone and Install

```bash
git clone https://github.com/adrienveepee/open-agent-builder.git
cd open-agent-builder
npm install
```

### 2. Create Environment Configuration

Create a `.env.local` file with minimal configuration:

```bash
# Storage: Use local file-based storage (no Convex needed)
STORAGE_BACKEND=local

# Auth: Disable authentication for single-user mode (no Clerk needed)
ENABLE_AUTH=false

# LLM: Add at least ONE LLM provider API key
ANTHROPIC_API_KEY=your-anthropic-key-here
```

### 3. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and start building workflows!

## What You'll Get in Self-Hosted Mode

✅ **Full workflow builder** - Visual drag-and-drop interface  
✅ **Local data storage** - All workflows saved in `data/` directory  
✅ **Single-user mode** - No login required  
✅ **AI agent execution** - Full LangGraph workflow engine  
✅ **MCP tool support** - Connect to any MCP server  

## What's Already Optional: Web Scraping

### Firecrawl (Optional Premium Service)

You don't need Firecrawl! Use any of these self-hosted alternatives:

Self-hosted alternatives:
- **Playwright** - Browser automation (fully self-hosted)
- **Puppeteer** - Headless Chrome (fully self-hosted)
- **Jina AI Reader** - Free API for web scraping

### E2B Code Interpreter

For sandboxed code execution:

```bash
E2B_API_KEY=e2b-your-key-here
```

## Data Location

All data is stored in the `data/` directory:

```
data/
├── workflows.json       # Your workflow definitions
├── executions.json      # Workflow execution history
├── mcp-servers.json     # MCP server configurations
└── user-llm-keys.json   # Encrypted LLM API keys
```

**Backup:** Simply copy the `data/` directory.

## Comparison Matrix

| Feature | Self-Hosted | Cloud Mode |
|---------|-------------|------------|
| Setup Time | < 5 minutes | ~15 minutes |
| External Dependencies | LLM API only | LLM + Convex + Clerk |
| Cost | Free (except LLM) | Convex + Clerk free tiers |
| Users | Single user | Multi-user |
| Data Storage | Local files | Cloud database |

