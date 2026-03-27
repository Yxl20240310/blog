import JSZip from 'jszip';
import { Article } from '../store/mockData';

export const downloadArticlesAsZip = async (articles: Article[]) => {
  const zip = new JSZip();

  articles.forEach(article => {
    const markdownContent = `---
title: \${article.title}
date: \${article.date}
tags: [\${article.tags.join(', ')}]
likes: \${article.likes}
views: \${article.views}
status: \${article.status}
---

\${article.content}`;

    const safeFileName = article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    zip.file(`\${safeFileName}.md`, markdownContent);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `my_articles_export_\${new Date().toISOString().split('T')[0]}.zip`;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};