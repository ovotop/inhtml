# in-html — 项目上下文

## 这是什么

`in-html` 是一个 npm 包，给 AI 一块"屏幕"。用户在 CLI 里与 Claude 对话，Claude 把富文本输出写成自包含的 HTML 文件，浏览器窗口实时显示一个卡片列表，点击卡片全屏查看。

```
CLI (左半屏)                    浏览器 (右半屏)
──────────────────              ──────────────────────────────
用户输入 prompt                  卡片列表 (旧→新，从上到下)
Claude 生成 HTML                 每张卡 = 用户 prompt + 产物标题
写入 .in-html/artifacts/         点击 → 全屏 iframe + 下载按钮
更新 manifest.json               manifest 变化 → SSE → 自动刷新
```

## 当前状态

**✅ 开发已完成** — 46/46 任务全部完成

### 已完成
- [x] 项目 scaffold（package.json, tsconfig.json, 目录结构）
- [x] 核心模块（manifest.ts, root.ts, server.ts, watcher.ts, cli.ts）
- [x] UI（assets/index.html，带 SSE、卡片列表、overlay）
- [x] Skill 文件（assets/skill.md）
- [x] 构建配置（tsup.config.ts）
- [x] 测试验证（服务器启动、manifest 更新、SSE 推送）
- [x] 修复：submit handler 支持纯文本和 JSON 格式

### 待完成
- [ ] npm publish（需要用户登录 npm 后手动执行）

## npm 包名

**`in-html`** — 已确认在 npm registry 可用

## 技术栈决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 语言 | TypeScript | npm 发布，类型安全 |
| 构建 | tsup | 打包成单文件 dist/cli.js |
| 文件监听 | chokidar | Linux fs.watch 不可靠 |
| 实时推送 | SSE (EventSource) | 单向推送够用，比 WebSocket 简单 |
| UI 框架 | 无（原生 HTML+CSS+JS） | 零依赖，自包含文件 |
| 浏览器打开 | open 包 | 跨平台 |
| 项目根目录检测 | 向上查找 .git / package.json | 与 git/npm 行为一致 |

## 目录约定

```
your-project/
  .in-html/               ← 运行时数据（建议加入 .gitignore）
    manifest.json         ← 产物注册表 []
    artifacts/
      0001.html
      0002.html
    pending.txt           ← 浏览器输入队列（可选）
  .claude/
    commands/
      in-html.md          ← Claude Code 技能
  .opencode/
    skills/
      in-html/
        SKILL.md          ← OpenCode 技能
```

UI (`index.html`) 从 npm 包内部提供，不复制到用户项目。

## manifest.json schema（v0.1 锁定）

```json
[
  {
    "id": "0001",
    "title": "Birchline — Engineering Status — Week 11",
    "type": "report",
    "prompt": "show me weekly engineering status",
    "timestamp": "2026-05-12T10:23:00Z"
  }
]
```

type 的合法值：`report` | `slide` | `diagram` | `flowchart` | `exploration` | `review` | `explainer` | `plan` | `tool`

## CLI 接口

```bash
npx in-html                    # 启动服务器 + 打开浏览器（默认端口 7654）
npx in-html --port 8080        # 自定义端口
npx in-html --no-open          # 不自动打开浏览器
npx in-html init-skill         # 放置 .claude/commands/in-html.md
npx in-html init-skill --force # 覆盖已有技能文件
```

## 服务器端点

| 端点 | 说明 |
|------|------|
| `GET /` | 提供 assets/index.html（注入 SSE 脚本） |
| `GET /manifest.json` | 提供 .in-html/manifest.json，Cache-Control: no-cache |
| `GET /artifacts/:id.html` | 静态提供产物文件，不注入脚本 |
| `GET /~events` | SSE 流，manifest 变化时发送 `data: r` |
| `POST /~submit` | 写入 pending.txt，打印到终端，支持纯文本和 JSON |

## 项目文件结构（已实现）

```
in-html/
  package.json              name: "in-html", bin: { "in-html": "./dist/cli.js" }
  tsconfig.json
  tsup.config.ts
  src/
    cli.ts                  入口，参数解析，分发命令
    server.ts               HTTP 服务器
    watcher.ts              chokidar 监听 manifest.json（50ms 防抖）
    manifest.ts             类型定义 + 读写 helpers
    root.ts                 向上查找项目根目录
  assets/
    index.html              卡片列表 UI ✓
    skill.md                Claude Code 技能文件 ✓
  docs/
    context.md              本文件
    architecture.md         架构图（Mermaid）
```

## 使用方式

### 启动服务器
```bash
npx in-html
# 或
npm run build && npx .
```

### 使用 Skill
```bash
# 1. 初始化技能文件（已做）
npx in-html init-skill

# 2. 在 Claude Code 中
/in-html 帮我创建一个状态报告

# 3. 在 OpenCode 中
/in-html 帮我创建一个状态报告
```

### 测试
```bash
# 启动服务器
npx in-html --no-open

# 测试提交
curl -X POST http://localhost:7654/~submit -H "Content-Type: text/plain" -d "test message"
```

## 架构图

详见 `docs/architecture.md`

## 设计资源

设计 token 和 UI 模板来自：`/home/mi/Documents/ai/html-effectiveness/`

UI 原型已完成：`assets/index.html`（功能完整，带动态 manifest 加载、SSE、overlay、下载）

技能使用的 HTML 示例库：
- `01` 代码方案对比，`03` PR review，`09` 幻灯片，`11` 状态报告
- `13` 流程图，`14/15` 解释器，`16` 实施计划，`18` 看板

## Openspec 变更状态

| 变更 | 状态 | 说明 |
|------|------|------|
| `html-effectiveness` | 已废弃 | Python 原型阶段，被 in-html 取代 |
| `in-html` | ✅ 全部 46 任务完成 | 开发完成，待发布 |

## 下一步

1. 测试：`npx in-html` 在项目目录启动
2. 测试：`/in-html` 在 OpenCode/Claude Code 中使用
3. 发布：`npm publish`（需要先 npm login）
