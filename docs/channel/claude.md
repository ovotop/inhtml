# Claude Code Channel 方案

## 概述

Claude Code 的 **Channels** 机制允许外部系统推送消息到 CLI session，效果等同于用户在终端输入。这是实现"浏览器输入 → CLI 响应"的最干净方案。

## 工作原理

```
浏览器                    in-html server           Channel MCP Server
──────                    ──────────────           ──────────────────
用户输入 ──POST /~hook──▶ 写 session.json
                          写 pending.txt
                          POST :8789 ─────────────▶ mcp.notification()
                                                    ↓
                                              Claude Code session
                                              收到 <channel> 标签
                                              像用户输入一样处理
                                                    ↓
                                              reply tool 被调用
                                                    ↓
                                              POST back to in-html
                                                    ↓
                          session.json 更新 ◀───────┘
                          SSE → 浏览器更新
```

## Channel 是什么

Channel 是一个 MCP Server，具备以下特征：

1. **声明 `claude/channel` capability** — 告诉 Claude Code 这是一个 channel
2. **监听外部输入** — HTTP 端口、WebSocket、或轮询外部 API
3. **推送 `notifications/claude/channel`** — 将消息注入 Claude Code session
4. **可选：暴露 reply tool** — 让 Claude 通过 channel 回复

Claude Code 启动时将 channel 作为子进程运行（通过 stdio 通信）。

## 关键代码结构

```typescript
// channel.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const mcp = new Server(
  { name: 'in-html-channel', version: '0.0.1' },
  {
    capabilities: {
      experimental: { 'claude/channel': {} },  // 必须
      tools: {},  // 可选，用于 reply tool
    },
    instructions: 'Messages arrive from in-html browser...',
  }
)

// 注册 reply tool（双向通信）
// 注册 HTTP listener（接收 in-html server 转发的消息）
// 调用 mcp.notification() 推送消息到 Claude Code
```

## 注册方式

在项目根目录创建 `.mcp.json`：

```json
{
  "mcpServers": {
    "in-html-channel": {
      "command": "bun",
      "args": ["./assets/channel.ts"]
    }
  }
}
```

启动 Claude Code 时加 flag（research preview 阶段）：

```bash
claude --dangerously-load-development-channels server:in-html-channel
```

## 限制

- **Research Preview** — 需要 `--dangerously-load-development-channels` flag
- **Claude Code only** — 仅适用于 Claude Code，OpenCode/Codex 需要其他方案
- **需要 bun/node** — Channel MCP server 需要运行时
- **claude.ai 认证** — 部分功能需要 claude.ai 账号（但 channel 本身不需要）

## 与 hooks 的关系

| 方向 | 机制 | 状态 |
|------|------|------|
| CLI → 浏览器 | Hooks (UserPromptSubmit, Stop, PostToolUse) | ✓ 已实现 |
| 浏览器 → CLI | Channel MCP Server | 待实现 |

两者互补：hooks 捕获 CLI 事件推送到浏览器，Channel 接收浏览器消息注入 CLI。

## 参考

- [Channels 文档](https://docs.anthropic.com/en/docs/claude-code/channels)
- [Channels Reference](https://docs.anthropic.com/en/docs/claude-code/channels-reference)
- [fakechat 示例](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/fakechat)
