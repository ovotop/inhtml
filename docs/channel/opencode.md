# OpenCode Channel 方案

## 概述

OpenCode 有内置的 REST API server（默认端口 `4096`），支持通过 HTTP 注入消息到 TUI 或 session。

## 工作原理

```
浏览器                    in-html server           OpenCode API (:4096)
──────                    ──────────────           ───────────────────
用户输入 ──POST /~hook──▶ 写 session.json
                          POST :4096/tui/append-prompt
                          POST :4096/tui/submit-prompt
                                                    ↓
                                              OpenCode session
                                              像用户输入一样处理
                                                    ↓
                                              回复通过 SSE 事件流
                                                    ↓
                          hook.sh 捕获 ◀────────────┘
                          session.json 更新
                          SSE → 浏览器更新
```

## 关键 API 端点

| 端点 | 方法 | 作用 |
|------|------|------|
| `/tui/append-prompt` | POST | 将文本填入 TUI 输入框 |
| `/tui/submit-prompt` | POST | 提交当前输入框内容（等同按 Enter） |
| `/tui/clear-prompt` | POST | 清空输入框 |
| `/session/{id}/prompt_async` | POST | 直接向 session 发送 prompt（异步） |
| `/session/{id}/command` | POST | 执行 session 命令 |

## 使用方式

**方式 1: TUI 注入（推荐）**
```bash
# 填入文本
curl -X POST http://localhost:4096/tui/append-prompt \
  -H "Content-Type: application/json" \
  -d '{"text": "帮我做个状态报告"}'

# 提交
curl -X POST http://localhost:4096/tui/submit-prompt
```

**方式 2: 直接发 prompt**
```bash
curl -X POST http://localhost:4096/session/{sessionID}/prompt_async \
  -H "Content-Type: application/json" \
  -d '{"parts": [{"type": "text", "text": "帮我做个状态报告"}]}'
```

## in-html 集成

在 in-html server 的 `POST /~hook` handler 中，当收到 `user_prompt` 事件时：

1. 调用 `POST :4096/tui/append-prompt` 填入文本
2. 调用 `POST :4096/tui/submit-prompt` 提交

不需要额外的 MCP server 或 channel — 直接调用 OpenCode 的 API。

## 限制

- **需要 OpenCode 运行** — API server 随 OpenCode TUI 一起启动
- **端口固定** — 默认 4096，可能需要配置
- **session ID** — 直接发 prompt 需要知道 session ID；TUI 方式不需要
- **无 reply 回调** — 回复通过 hooks 捕获，不是通过 API 回调

## 参考

- SDK: `@opencode-ai/sdk` — `http://localhost:4096`
- 默认端口: 4096（在 `client.gen.js` 中定义）
