# Codex Channel 方案

## 概述

Codex 有 app-server 协议，支持通过 WebSocket 发送 `turn/start` 请求注入用户消息。

## 工作原理

```
浏览器                    in-html server           Codex App-Server
──────                    ──────────────           ────────────────
用户输入 ──POST /~hook──▶ 写 session.json
                          WebSocket / HTTP ───────▶ turn/start
                                                    ↓
                                              Codex session
                                              像用户输入一样处理
                                                    ↓
                                              回复通过 hooks
                                                    ↓
                          hook.sh 捕获 ◀────────────┘
                          session.json 更新
                          SSE → 浏览器更新
```

## 关键 API

| 方法 | 作用 |
|------|------|
| `turn/start` | 开始新的 turn（发送用户消息） |
| `turn/steer` | 在当前 turn 中追加输入（引导 AI） |
| `turn/interrupt` | 中断当前 turn |

## 使用方式

Codex 的 app-server 通过 WebSocket 通信：

```bash
# 启动 Codex 时连接到 app-server
codex --remote ws://localhost:PORT
```

发送 turn/start：
```json
{
  "thread_id": "...",
  "input": [{"type": "text", "text": "帮我做个状态报告"}]
}
```

## 与 Claude Code Channel 的对比

| 维度 | Claude Code Channel | Codex App-Server |
|------|---------------------|------------------|
| 通信方式 | MCP stdio + HTTP | WebSocket |
| 消息注入 | `notifications/claude/channel` | `turn/start` |
| 回复机制 | reply tool | hooks + event stream |
| 复杂度 | 中等（需要 MCP server） | 较高（需要 WS 连接管理） |
| 成熟度 | Research Preview | Experimental |

## in-html 集成

需要：
1. in-html server 维护一个 WebSocket 连接到 Codex app-server
2. 收到浏览器消息时，通过 WS 发送 `turn/start`
3. 通过 hooks 捕获回复事件

## 限制

- **Experimental** — app-server 标记为 experimental
- **WebSocket** — 需要持久连接管理
- **认证** — 可能需要 auth token
- **thread ID** — 需要知道当前 thread ID

## 参考

- 源码: `codex-rs/app-server-protocol/src/protocol/v2/turn.rs`
- 启动: `codex app-server --listen ws://127.0.0.1:PORT`
