export interface Comment {
  id: string;
  articleId: string;
  author: string;
  content: string;
  date: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  likes: number;
  dislikes: number;
  views: number;
  date: string;
  status: 'draft' | 'published';
  visibility: 'public' | 'private' | 'restricted';
  allowedUsers?: string[];
  folderId?: string | null;
  authorId?: string;
}

export const mockFolders: Folder[] = [
  { id: 'f1', name: 'React 生态', createdAt: '2026-03-20T10:00:00Z' },
  { id: 'f2', name: 'Rust 与工程化', createdAt: '2026-03-22T08:00:00Z' },
  { id: 'f3', name: '设计与体验', createdAt: '2026-03-25T14:00:00Z' },
];

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "探索 React 18 并发特性的底层原理",
    summary: "本文将带你深入理解 React 18 的并发渲染模型，剖析 Fiber 架构的运作机制。",
    content: `
# 探索 React 18 并发特性的底层原理

React 18 引入了一系列改变游戏规则的并发特性，如 \`useTransition\` 和 \`useDeferredValue\`。但这些 API 背后的魔法到底是什么？

## Fiber 架构的回顾

在深入并发之前，我们需要回顾一下 Fiber 架构。Fiber 本质上是 React 内部的一个虚拟栈帧，它允许 React 暂停、恢复甚至中止渲染工作。

\`\`\`javascript
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
\`\`\`

## 并发渲染的优势

传统的渲染是同步的，一旦开始就不能被中断，这会导致主线程被长时间阻塞。并发渲染允许 React 将渲染工作拆分成小块，并在浏览器空闲时执行。

- **提升响应性**：用户输入和动画不会被繁重的渲染任务卡住。
- **状态过渡**：可以在后台准备新页面的 DOM，准备好后再平滑过渡。

这是前端体验的一大飞跃！
    `,
    tags: ["React", "前端开发", "源码解析"],
    likes: 342,
    dislikes: 12,
    views: 1205,
    date: "2026-03-20",
    status: 'published',
    visibility: 'public',
    folderId: 'f1',
    authorId: 'admin',
  },
  {
    id: "2",
    title: "Rust 在前端构建工具中的崛起",
    summary: "从 SWC 到 Turbopack，Rust 正在以前所未有的速度重塑前端基础设施。",
    content: `
# Rust 在前端构建工具中的崛起

近年来，我们见证了一个显著的趋势：越来越多的前端构建工具开始使用 Rust 重写。为什么是 Rust？

## 性能的极致追求

JavaScript (Node.js) 虽然在 V8 引擎的加持下速度已经很快，但在处理大型项目的文件 I/O 和 AST 解析时，依然显得捉襟见肘。Rust 提供了无垃圾回收（GC）的内存管理机制，以及极致的执行效率。

- **SWC**：基于 Rust 的可扩展编译器，速度是 Babel 的 20 倍以上。
- **Turbopack**：由 Webpack 作者编写，号称比 Vite 快 10 倍。

## 安全性与并行计算

Rust 的所有权模型在编译期就消除了数据竞争，这使得开发者可以放心地编写多线程程序，从而充分利用多核 CPU 的性能。

这不仅仅是工具的升级，更是前端工程化的一次工业革命。
    `,
    tags: ["Rust", "前端工程化", "性能优化"],
    likes: 512,
    dislikes: 60, // 这个点踩数量大于 10%，用于测试首页不展示逻辑
    views: 2301,
    date: "2026-03-22",
    status: 'published',
    visibility: 'public',
    folderId: 'f2',
  },
  {
    id: "3",
    title: "使用 Tailwind CSS 构建赛博朋克风格 UI",
    summary: "打破常规，利用 Tailwind 的灵活性实现极致的视觉体验。",
    content: `
# 使用 Tailwind CSS 构建赛博朋克风格 UI

赛博朋克（Cyberpunk）风格以其高对比度的霓虹色彩、暗黑背景和科技感元素著称。如何用 Tailwind CSS 实现这种风格？

## 核心设计语言

1. **暗色背景**：使用极暗的灰黑色，如 \`bg-[#050505]\`。
2. **霓虹高光**：青色（Cyan）和紫色（Purple）是标配。
3. **发光效果**：利用 \`box-shadow\` 和 \`text-shadow\`。

## 示例代码

这是一个简单的赛博朋克按钮示例：

\`\`\`html
<button class="px-6 py-2 bg-black border border-cyan-500 text-cyan-400 font-mono tracking-widest hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300">
  INITIALIZE
</button>
\`\`\`

通过组合简单的类名，我们就能创造出极具未来感的界面。
    `,
    tags: ["CSS", "Tailwind", "设计"],
    likes: 289,
    dislikes: 5,
    views: 980,
    date: "2026-03-25",
    status: 'published',
    visibility: 'public',
    folderId: 'f3',
  },
  {
    id: "4",
    title: "Web3 时代的去中心化身份验证 (DID)",
    summary: "告别账号密码，使用钱包签名实现安全、私密的身份认证系统。",
    content: `
# Web3 时代的去中心化身份验证 (DID)

在传统的 Web2 应用中，用户数据和身份通常被中心化服务器掌控。而在 Web3 中，去中心化身份（Decentralized Identifier, DID）成为了新的标准。

## 为什么需要 DID？

- **隐私保护**：用户掌控自己的数据，不依赖第三方。
- **抗审查**：没有中心机构可以封禁你的账号。
- **单点登录**：一个钱包地址即可通行所有 DApp。

## 工作原理

1. 用户在前端连接数字钱包（如 MetaMask）。
2. 后端生成一段随机的 Nonce 字符串。
3. 用户使用钱包对该 Nonce 进行密码学签名。
4. 后端验证签名，确认用户对该地址拥有控制权。

这是一种优雅且极其安全的认证方式。
    `,
    tags: ["Web3", "区块链", "安全"],
    likes: 156,
    dislikes: 2,
    views: 890,
    date: "2026-03-26",
    status: 'published',
    visibility: 'restricted',
    allowedUsers: ['user1', 'admin'],
  },
];

export const mockComments: Comment[] = [
  {
    id: "c1",
    articleId: "1",
    author: "GeekUser_01",
    content: "非常深度的文章！对 Fiber 架构的解释很透彻。",
    date: "2026-03-21T10:00:00Z",
  },
  {
    id: "c2",
    articleId: "1",
    author: "FrontendNinja",
    content: "期待后续关于 useTransition 的实战案例分析。",
    date: "2026-03-21T14:30:00Z",
  },
  {
    id: "c3",
    articleId: "2",
    author: "Rustacean",
    content: "Rust is the future!",
    date: "2026-03-23T09:15:00Z",
  },
];
