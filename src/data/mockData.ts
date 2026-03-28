export interface User {
  id: string;
  username: string;
  password?: string; // Stored in local for mock
  createdAt: string;
  lastLoginTime?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  likes: number;
  dislikes?: number;
  tags: string[];
  date: string;
  author: string;
  readTime: string;
  published: boolean;
  visibility?: 'public' | 'private' | 'partial';
  allowedUsers?: string[]; // array of usernames
}

export interface Comment {
  id: string;
  articleId: string;
  username: string;
  content: string;
  date: string;
}

export const articles: Article[] = [
  {
    id: "1",
    title: "构建下一代赛博朋克风格 Web 应用",
    excerpt: "探讨如何在现代前端框架中实现极致的科技感设计，结合 Framer Motion 与 Tailwind CSS 打造令人惊艳的用户体验。",
    content: `## 引言

在当今的 Web 开发中，用户体验不仅仅是快速的加载和无 Bug 的交互，**视觉冲击力**同样占据着举足轻重的地位。赛博朋克（Cyberpunk）风格以其独特的深色背景、高对比度的霓虹色彩以及科技感十足的几何图形，逐渐成为极客和开发者们最喜爱的设计风格之一。

## 核心设计理念

1. **深色背景与霓虹强调色**：
   使用 \`#0F172A\` 或纯黑作为主背景，搭配高饱和度的青色（Cyan）、品红色（Magenta）和荧光绿（Neon Green）作为点缀。
2. **光晕与阴影效果**：
   通过 CSS 的 \`box-shadow\` 和 \`text-shadow\` 实现发光效果（Glow Effect）。
3. **毛玻璃效果（Glassmorphism）**：
   利用背景模糊（\`backdrop-filter\`）让界面具有层次感和透明度。

## 技术栈选择

- **React / Vue**：组件化构建界面。
- **Tailwind CSS**：提供原子化的工具类，快速实现复杂的阴影和背景效果。
- **Framer Motion**：为组件进入和退出提供流畅的物理动画。

## 代码示例

下面是一个简单的毛玻璃卡片 Tailwind 类名组合：
\`\`\`html
<div class="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
  <h3 class="text-neon-green font-mono">Hello Cyberpunk</h3>
</div>
\`\`\`

## 总结

科技感设计不仅仅是堆砌特效，更需要注重信息的层级和阅读体验。希望本文能为你构建下一个酷炫的个人项目提供灵感！`,
    likes: 1256,
    tags: ["前端", "设计", "UI/UX"],
    date: "2023-10-24",
    author: "TechNinja",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "深入理解 React 18 并发渲染机制",
    excerpt: "解析 React 18 中的 Concurrent Mode，带你从源码和应用场景双重角度掌握 useTransition 和 useDeferredValue 的精髓。",
    content: `## 什么是并发渲染？

React 18 引入的 Concurrent Rendering（并发渲染）是 React 架构的一次重大升级。它允许 React 在后台中断、暂停、恢复或放弃渲染，从而保证主线程的流畅性。

## useTransition 的魅力

\`useTransition\` 可以让你将某些状态更新标记为“非紧急”（Transition）。这在处理繁重的数据过滤或大列表渲染时非常有用。

\`\`\`tsx
const [isPending, startTransition] = useTransition();
const [query, setQuery] = useState('');

const handleChange = (e) => {
  // 紧急更新：输入框的值立即改变
  setQuery(e.target.value);
  
  startTransition(() => {
    // 非紧急更新：过滤列表的数据
    setFilterResult(filterData(e.target.value));
  });
};
\`\`\`

## 性能优化建议

不要滥用并发特性。只有在确实遇到渲染阻塞或用户交互卡顿的地方，才去使用它们。对于大部分轻量级的 UI 更新，同步渲染依然是最高效的。`,
    likes: 892,
    tags: ["React", "前端", "性能优化"],
    date: "2023-11-02",
    author: "CodeMaster",
    readTime: "8 min read"
  },
  {
    id: "3",
    title: "Rust 在 WebAssembly 中的应用与实践",
    excerpt: "为什么前端开发者应该关注 Rust？通过实际案例展示如何将复杂计算逻辑通过 WASM 转移到前端执行。",
    content: `## WebAssembly 简介

WebAssembly (WASM) 是一种新的编码方式，可以在现代网络浏览器中运行。它是一种低级的类汇编语言，具有紧凑的二进制格式，可以以接近原生的性能运行。

## 为什么选择 Rust？

Rust 拥有出色的内存安全性、零成本抽象以及极小的运行时。这使得它成为编译到 WASM 的完美选择。

## 实践：图像处理

假设我们需要在浏览器中进行复杂的矩阵运算以实现滤镜效果：

\`\`\`rust
#[wasm_bindgen]
pub fn apply_grayscale(mut image_data: Vec<u8>) -> Vec<u8> {
    for i in (0..image_data.len()).step_by(4) {
        let r = image_data[i] as f32;
        let g = image_data[i + 1] as f32;
        let b = image_data[i + 2] as f32;
        
        let gray = (r * 0.299 + g * 0.587 + b * 0.114) as u8;
        
        image_data[i] = gray;
        image_data[i + 1] = gray;
        image_data[i + 2] = gray;
    }
    image_data
}
\`\`\`

前端只需调用编译后的 WASM 模块，即可享受飞一般的执行速度！`,
    likes: 1024,
    tags: ["Rust", "WASM", "全栈"],
    date: "2023-11-15",
    author: "TechNinja",
    readTime: "10 min read"
  },
  {
    id: "4",
    title: "AI 时代下的全栈开发范式演进",
    excerpt: "探讨大模型如何重塑软件工程生命周期，以及开发者应如何适应并利用 AI 提升效率。",
    content: `## AI 正在改变游戏规则

从 GitHub Copilot 到 ChatGPT，再到现在的各种 AI 代理，AI 已经深入到代码生成、代码审查、测试编写的每一个环节。

## 核心思考

作为开发者，我们的核心竞争力正在从“写出没有语法错误的代码”向“准确描述业务需求并架构系统”转变。

未来的全栈开发者，或许应该叫做 **“AI 驱动型全栈工程师”**。`,
    likes: 3105,
    tags: ["AI", "全栈", "思考"],
    date: "2023-12-01",
    author: "FutureSeeker",
    readTime: "6 min read"
  },
  {
    id: "5",
    title: "Tailwind CSS 高阶技巧与最佳实践",
    excerpt: "告别杂乱无章的类名，掌握组件化提取、自定义插件和主题配置的高级姿势。",
    content: `## 工具类的困境

Tailwind CSS 的缺点在于容易导致 HTML 结构变得臃肿。

## 解决方案

1. **利用 @apply 提取组件**
2. **动态类名使用 clsx 或 tailwind-merge**

\`\`\`ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
\`\`\`
`,
    likes: 645,
    tags: ["CSS", "前端", "UI/UX"],
    date: "2024-01-10",
    author: "UIWizard",
    readTime: "4 min read"
  }
];

export const getAllTags = () => {
  const tags = new Set<string>();
  articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
};