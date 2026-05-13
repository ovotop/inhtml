# in-html 架构图

```mermaid
graph TB
    subgraph "用户环境"
        User[用户]
        CLI[CLI 终端]
        Browser[浏览器]
    end

    subgraph "in-html npm 包"
        CLIEntry[src/cli.ts<br/>命令行入口]
        Server[src/server.ts<br/>HTTP 服务器]
        Watcher[src/watcher.ts<br/>文件监听]
        Manifest[src/manifest.ts<br/>类型定义]
        Root[src/root.ts<br/>项目根检测]
        
        IndexHTML[assets/index.html<br/>卡片列表 UI]
        SkillMD[assets/skill.md<br/>Claude 技能]
    end

    subgraph "用户项目目录"
        DotInHTML[.in-html/]
        ManifestJSON[manifest.json]
        Artifacts[artifacts/]
        PendingTXT[pending.txt]
        SkillTarget[.claude/commands/in-html.md]
    end

    subgraph "Claude Code"
        Claude[Claude AI]
    end

    User -->|npx in-html| CLIEntry
    CLIEntry -->|解析参数| Root
    Root -->|查找项目根| CLIEntry
    CLIEntry -->|启动| Server
    CLIEntry -->|启动| Watcher
    CLIEntry -->|可选| Browser

    Server -->|GET /| IndexHTML
    Server -->|GET /manifest.json| ManifestJSON
    Server -->|GET /artifacts/:id| Artifacts
    Server -->|GET /~events| Browser
    Server -->|POST /~submit| PendingTXT

    Watcher -->|监听变化| ManifestJSON
    Watcher -->|广播 SSE| Server

    Browser -->|加载| IndexHTML
    Browser -->|fetch| ManifestJSON
    Browser -->|SSE| Server
    Browser -->|POST| PendingTXT

    Claude -->|读写| ManifestJSON
    Claude -->|写入| Artifacts
    Claude -->|读取| SkillTarget

    CLIEntry -->|init-skill| SkillTarget
    SkillMD -->|复制| SkillTarget

    Manifest -.->|类型定义| ManifestJSON

    style DotInHTML fill:#f9f,stroke:#333
    style ManifestJSON fill:#bbf,stroke:#333
    style Artifacts fill:#bfb,stroke:#333
    style PendingTXT fill:#fbf,stroke:#333
```

## 数据流

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户工作流                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 用户运行 npx in-html                                        │
│     ↓                                                           │
│  2. 服务器启动，浏览器打开                                        │
│     ↓                                                           │
│  3. 用户在 CLI 中与 Claude 对话                                  │
│     ↓                                                           │
│  4. Claude 生成 HTML → 写入 artifacts/0001.html                  │
│     ↓                                                           │
│  5. Claude 更新 manifest.json                                   │
│     ↓                                                           │
│  6. Watcher 检测变化 → 广播 SSE                                  │
│     ↓                                                           │
│  7. 浏览器收到事件 → 刷新卡片列表                                 │
│     ↓                                                           │
│  8. 用户点击卡片 → 全屏查看 HTML                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 组件职责

| 组件 | 职责 |
|------|------|
| `cli.ts` | 命令行解析、启动服务器、初始化技能 |
| `server.ts` | HTTP 路由、SSE 推送、提交处理 |
| `watcher.ts` | 监听 manifest.json 变化、50ms 防抖 |
| `manifest.ts` | 类型定义、读写 helpers |
| `root.ts` | 向上查找 .git/package.json |
| `index.html` | 卡片列表 UI、SSE 连接、提交表单 |
| `skill.md` | Claude Code 技能定义 |
