/**
 * 计算文章阅读时间和字数
 * @param {string} content - 文章内容文本
 * @param {number} wordsPerMinute - 每分钟阅读字数（默认300字/分钟）
 * @returns {object} { readTime: 阅读时间(分钟), wordCount: 总字数 }
 */
export const calculateReadTime = (content, wordsPerMinute = 300) => {
  if (!content) return { readTime: 1, wordCount: 0 };
  
  // 过滤HTML标签（如果内容包含HTML）
  const pureText = content.replace(/<[^>]+>/g, '').trim();
  
  // 简单字数统计（中英文均按字符计算）
  const wordCount = pureText.length;
  
  // 计算阅读时间，最少1分钟
  const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  
  return { readTime, wordCount };
};
    