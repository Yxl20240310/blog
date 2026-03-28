export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  likes: number;
  tags: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  username: string;
  text: string;
  createdAt: string;
}

const INITIAL_ARTICLES: Article[] = [
  {
    id: "1",
    title: "量子计算的突破：2026年技术展望",
    summary: "探讨最新的量子比特稳定性突破及其对密码学和未来计算架构的深远影响。",
    content: "量子计算不再仅仅是理论。近期实验室成功将相干时间延长了三个数量级。这意味着我们距离实用的通用量子计算机又近了一大步。\n\n### 核心突破\n最新的拓扑量子错误修正算法极大地减少了环境噪声对量子比特的干扰。\n\n### 影响\n现有的RSA和ECC加密算法在未来十年内可能会面临被破解的风险，因此后量子密码学（Post-Quantum Cryptography）的研究变得刻不容缓。",
    likes: 1024,
    tags: ["量子计算", "未来科技", "密码学"],
    createdAt: "2026-03-25T10:00:00Z"
  },
  {
    id: "2",
    title: "脑机接口：人类与AI的最终融合",
    summary: "解析非侵入式脑机接口技术的最新进展，以及如何实现思维级别的全双工通信。",
    content: "随着传感技术的迭代，我们正在见证一种全新的交互范式。想象一下，无需键盘和鼠标，仅凭意念即可控制数字世界。\n\n目前的非侵入式头带已经可以以惊人的准确率读取运动皮层的电信号，将其转化为屏幕上的高精度操作。\n\n未来，我们将实现不仅是读取（Read），更是写入（Write）的双向通信。",
    likes: 856,
    tags: ["脑机接口", "AI", "赛博朋克"],
    createdAt: "2026-03-20T14:30:00Z"
  },
  {
    id: "3",
    title: "构建具有“科技感”的现代Web应用",
    summary: "从设计系统到代码实现，揭秘如何使用React和Tailwind CSS打造赛博朋克风格的UI。",
    content: "在现代Web设计中，科技感通常意味着深色背景、高对比度的霓虹色点缀以及毛玻璃效果。\n\n关键元素包括：\n- **深色模式**：纯黑或深渊蓝作为底色。\n- **霓虹强调色**：如青色（Cyan）或紫色（Magenta）。\n- **发光效果（Glow）**：利用CSS的`box-shadow`和`drop-shadow`。\n\n我们来看一下具体的实现代码：\n```tsx\n<div className=\"glass-panel glow-cyan\">\n  <h2 className=\"text-neon-cyan font-mono\">Hello World</h2>\n</div>\n```",
    likes: 2048,
    tags: ["Web开发", "React", "UI/UX", "Tailwind"],
    createdAt: "2026-03-28T09:15:00Z"
  },
  {
    id: "4",
    title: "Web3.0与去中心化身份验证(DID)",
    summary: "详解基于零知识证明的去中心化身份系统如何在保护隐私的同时完成验证。",
    content: "在这个数据隐私日益重要的时代，传统的中心化身份系统显得脆弱不堪。\n\n基于零知识证明（ZKP）的DID系统允许用户证明自己满足某项条件（如年龄大于18岁），而无需透露具体的出生日期等隐私信息。\n\n### ZK-Rollups 的应用\n这不仅提升了以太坊等区块链的吞吐量，更为身份验证提供了极其高效且低成本的方案。",
    likes: 512,
    tags: ["Web3", "区块链", "隐私保护"],
    createdAt: "2026-03-15T08:00:00Z"
  }
];

export const initMockData = () => {
  if (!localStorage.getItem("blog_articles")) {
    localStorage.setItem("blog_articles", JSON.stringify(INITIAL_ARTICLES));
  }
  if (!localStorage.getItem("blog_comments")) {
    localStorage.setItem("blog_comments", JSON.stringify([]));
  }
};

export const getArticles = (): Article[] => {
  const data = localStorage.getItem("blog_articles");
  return data ? JSON.parse(data) : [];
};

export const getArticleById = (id: string): Article | undefined => {
  return getArticles().find(a => a.id === id);
};

export const getCommentsByArticleId = (articleId: string): Comment[] => {
  const data = localStorage.getItem("blog_comments");
  const comments: Comment[] = data ? JSON.parse(data) : [];
  return comments.filter(c => c.articleId === articleId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addComment = (comment: Omit<Comment, "id" | "createdAt">) => {
  const data = localStorage.getItem("blog_comments");
  const comments: Comment[] = data ? JSON.parse(data) : [];
  const newComment: Comment = {
    ...comment,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString()
  };
  comments.push(newComment);
  localStorage.setItem("blog_comments", JSON.stringify(comments));
  return newComment;
};

export const likeArticle = (id: string) => {
  const articles = getArticles();
  const updated = articles.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a);
  localStorage.setItem("blog_articles", JSON.stringify(updated));
};
