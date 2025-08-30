import jieba from 'node-jieba';
import matter from 'gray-matter';
import fs from 'fs-extra';

const stopWords = new Set([
  '的', '是', '了', '在', '我', '你', '他', '她', '它', '我们', '你们', '他们',
  '一个', '这个', '那个', '一些', '什么', '怎么', '为什么', '如何', '都', '也',
  '还', '就', '但', '可', '而', '已', '把', '被', '与', '和', '或', '等', '地', '得',
  'the', 'a', 'an', 'is', 'are', 'am', 'was', 'were', 'be', 'being', 'been',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'as',
  'and', 'or', 'but', 'if', 'that', 'this', 'that', 'these', 'those', 'it',
]);

export const generateSiteStats = (posts) => {
  let totalWordCount = 0;
  let longestPost = { title: '', wordCount: 0, regularPath: '' };
  let shortestPost = { title: '', wordCount: Infinity, regularPath: '' };
  const allWords = [];
  const publishMonths = {};
  const publishWeekdays = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
  const tagsData = {};
  const punctuationData = {};

  posts.forEach(post => {
    const fileContent = fs.readFileSync(post.regularPath.slice(1).replace('.html', '.md'), 'utf-8');
    const { content } = matter(fileContent);

    const plainText = content
      .replace(/---[\s\S]*?---/, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/[#*`_~->[\]()|]/g, '')
      .toLowerCase();

    const wordCount = plainText.replace(/\s/g, '').length;
    totalWordCount += wordCount;
    if (wordCount > longestPost.wordCount) {
      longestPost = { title: post.title, wordCount, regularPath: post.regularPath };
    }
    if (wordCount < shortestPost.wordCount) {
      shortestPost = { title: post.title, wordCount, regularPath: post.regularPath };
    }
    
    if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
            tagsData[tag] = (tagsData[tag] || 0) + 1;
        });
    }

    const punctuations = plainText.match(/[！。？，、；：“”《》（）]/g) || [];
    punctuations.forEach(p => {
        punctuationData[p] = (punctuationData[p] || 0) + 1;
    });
    
    const words = jieba.cut(plainText);
    allWords.push(...words);
    
    const postDate = new Date(post.date);
    const monthKey = `${postDate.getFullYear()}-${String(postDate.getMonth() + 1).padStart(2, '0')}`;
    publishMonths[monthKey] = (publishMonths[monthKey] || 0) + 1;
    publishWeekdays[postDate.getDay()] = (publishWeekdays[postDate.getDay()] || 0) + 1;
  });

  const wordFrequencies = {};
  allWords.forEach(word => {
    const trimmedWord = word.trim();
    if (trimmedWord.length > 1 && !stopWords.has(trimmedWord) && !/^\d+$/.test(trimmedWord)) {
      wordFrequencies[trimmedWord] = (wordFrequencies[trimmedWord] || 0) + 1;
    }
  });
  
  const topWords = Object.entries(wordFrequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const topTags = Object.entries(tagsData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topPunctuation = Object.entries(punctuationData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return {
    postCount: posts.length,
    totalWordCount,
    avgWordCount: Math.round(totalWordCount / (posts.length || 1)),
    longestPost,
    shortestPost,
    topWords,
    topTags,
    topPunctuation,
    publishMonths,
    publishWeekdays: Object.values(publishWeekdays),
  };
};