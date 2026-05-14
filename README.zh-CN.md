# inhtml

[English](README.md)

给 AI 一块屏幕。CLI 对话中的富 HTML 输出。

## 安装

```bash
npm install -g @ovotop/inhtml
```

或直接使用 npx（无需安装）：

```bash
npx @ovotop/inhtml init
```

## 使用

### 初始化项目

```bash
cd your-project
inhtml init              # 全局安装后
npx @ovotop/inhtml init  # 使用 npx
```

这会自动完成：
- 创建 `.inhtml/` 运行时目录
- 安装 AI 工具钩子（Claude Code / OpenCode / Codex）
- 安装 Claude Code 技能（`.claude/commands/inhtml.md`）

### 开始对话

初始化后，直接在 CLI 中与 AI 对话即可。AI 会自动启动服务器并生成 HTML 工件。

```
You: 帮我画个架构图
AI:  [自动启动 inhtml 服务器]
     [生成 HTML 工件]
     [浏览器自动打开，显示卡片]
```

### 命令行选项

```bash
npx @ovotop/inhtml              # 启动服务器（端口 7654）
npx @ovotop/inhtml --port 8080  # 自定义端口
npx @ovotop/inhtml --no-open    # 不自动打开浏览器
npx @ovotop/inhtml init         # 初始化项目
npx @ovotop/inhtml init --force # 覆盖现有配置
```

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户环境                              │
├─────────────────────────────────────────────────────────────┤
│  CLI 终端             ┌──────────┐           浏览器          │
│  (npx @ovotop/inhtml)   ────▶│  服务器  │────▶  localhost:7654     │
│                       └──────────┘                          │
├─────────────────────────────────────────────────────────────┤
│                    inhtml npm 包                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  cli.ts  │  │server.ts │  │watcher.ts│  │  root.ts │    │
│  │   入口   │  │HTTP · SSE│  │ 文件监控 │  │ 查找根目录│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
├─────────────────────────────────────────────────────────────┤
│                   运行时数据 (.inhtml/)                      │
│  session.json · manifest.json · artifacts/ · live.json       │
└─────────────────────────────────────────────────────────────┘
```

### 组件

| 模块 | 文件 | 职责 |
|------|------|------|
| CLI | `src/cli.ts` | 参数解析，命令分发 |
| 服务器 | `src/server.ts` | HTTP 路由，SSE 流，钩子处理 |
| 监视器 | `src/watcher.ts` | 文件监控，变更广播 |
| 根目录 | `src/root.ts` | 查找项目根目录 |
| UI | `assets/index.html` | 浏览器界面 |
| 技能 | `assets/skill.md` | AI 生成 HTML 的指令 |
| 钩子 | `assets/hook.sh` | CLI 工具集成 |
| 插件 | `assets/opencode-plugin.ts` | OpenCode 集成 |

## 工作原理

### 数据流

```
用户 ──▶ CLI ──▶ 服务器 ──▶ 浏览器
                │
                ├── GET  /           → index.html
                ├── GET  /session.json → 聊天历史
                ├── GET  /manifest.json → 工件注册表
                ├── GET  /~events    → SSE 流
                ├── GET  /artifacts/:id → HTML 文件
                └── POST /~hook      ← AI 工具事件
```

### 工作流程

1. 用户在项目目录运行 `npx @ovotop/inhtml init`
2. 用户在 CLI 中与 AI 对话
3. AI 检测到 inhtml 技能，自动启动服务器
4. AI 生成 HTML 工件 → 写入 `.inhtml/artifacts/`
5. AI 发送钩子事件 → 服务器更新 `session.json`
6. 监视器检测变更 → SSE 广播到浏览器
7. 浏览器渲染带预览的卡片
8. 点击卡片全屏查看

### 钩子集成

AI 工具通过 `POST /~hook` 发送事件到服务器：

```json
{"event": "user_prompt", "text": "创建一个流程图"}
{"event": "ai_response", "text": "流程图已创建完成。"}
{"event": "artifact_created", "artifactId": "0001"}
```

## 目录结构

```
your-project/
  .inhtml/               ← 运行时数据（添加到 .gitignore）
    session.json          ← 聊天历史
    manifest.json         ← 工件注册表
    live.json             ← 实时 AI 输出
    artifacts/
      0001.html
      0002.html
    hooks/
      hook.sh             ← 钩子脚本
  .claude/
    commands/
      inhtml.md          ← Claude Code 技能（自动启动服务器）
  .opencode/
    plugins/
      inhtml-sync.ts     ← OpenCode 插件
```

## 继续开发

```bash
git clone <repo>
cd inhtml
npm install
npm run build    # 构建
npm run dev      # 监听模式
```

### 项目结构

```
inhtml/
  src/
    cli.ts           # 入口点，参数解析
    server.ts        # HTTP 服务器，SSE，路由
    watcher.ts       # 文件变更监控
    root.ts          # 项目根目录检测
  assets/
    index.html       # 浏览器 UI
    skill.md         # AI 技能定义（含服务器启动逻辑）
    hook.sh          # 钩子脚本
    opencode-plugin.ts # OpenCode 插件
  dist/              # 构建输出
```

### 关键技术

- **运行时**: Node.js 18+
- **语言**: TypeScript
- **构建**: tsup
- **文件监控**: chokidar
- **实时通信**: SSE（服务器推送事件）

## 许可证

MIT
