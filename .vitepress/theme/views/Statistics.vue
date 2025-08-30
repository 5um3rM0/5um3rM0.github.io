<template>
  <div class="statistics-page s-card">
    <h1><i class="iconfont icon-chart"></i> 站点数据档案馆</h1>
    <p>这里是关于本站的一些有趣的数据洞察，它们完全由程序在每次网站构建时自动分析生成。</p>

    <div class="stats-group">
      <h2><i class="iconfont icon-article"></i> 内容概览</h2>
      <div class="stats-cards">
        <div class="stat-card">
          <div class="value">{{ stats.postCount }}</div><div class="label">文章总数</div>
        </div>
        <div class="stat-card">
          <div class="value">{{ (stats.totalWordCount / 10000).toFixed(1) }} 万</div><div class="label">全站总字数</div>
        </div>
        <div class="stat-card">
          <div class="value">{{ stats.avgWordCount }}</div><div class="label">平均篇幅</div>
        </div>
      </div>
      <div class="stats-list">
        <div><strong>最长文章：</strong><a :href="stats.longestPost.regularPath">{{ stats.longestPost.title }}</a> ({{ stats.longestPost.wordCount }} 字)</div>
        <div><strong>最短文章：</strong><a :href="stats.shortestPost.regularPath">{{ stats.shortestPost.title }}</a> ({{ stats.shortestPost.wordCount }} 字)</div>
      </div>
    </div>

    <div class="stats-group">
      <h2><i class="iconfont icon-star"></i> 我的词汇 DNA</h2>
      <p>我最常使用的词语 Top 20：</p>
      <div class="word-cloud">
        <span v-for="([word, count]) in stats.topWords" :key="word" class="word-item">
          {{ word }} <sup>{{ count }}</sup>
        </span>
      </div>
    </div>

    <div class="stats-group">
      <h2><i class="iconfont icon-hashtag"></i> 标签偏好</h2>
      <p>我最常使用的标签 Top 10：</p>
      <div class="word-cloud">
        <span v-for="([tag, count]) in stats.topTags" :key="tag" class="word-item tag-item">
          {{ tag }} <sup>{{ count }}</sup>
        </span>
      </div>
    </div>
    
    <div class="stats-group">
      <h2><i class="iconfont icon-quote"></i> 标点符号情结</h2>
      <p>从标点符号的使用频率，或许能一窥我的写作风格：</p>
      <div class="punctuation-list">
        <div v-for="([punc, count]) in stats.topPunctuation" :key="punc" class="punc-item">
          <span class="punc">{{ punc }}</span>
          <div class="punc-bar" :style="{ width: `${(count / stats.topPunctuation[0][1]) * 100}%` }"></div>
          <span class="count">{{ count }} 次</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress';
const { theme } = useData();
const stats = theme.value.siteStats;
</script>

<style lang="scss" scoped>
.statistics-page { padding: 2rem 2.5rem; }
h1 { display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 0.5rem; }
h1 .iconfont { margin-right: 1rem; font-size: 2.2rem; }
p { text-align: center; color: var(--main-font-second-color); margin-bottom: 3rem; }
.stats-group { margin-bottom: 3rem; }
.stats-group h2 { display: flex; align-items: center; font-size: 1.5rem; border-bottom: 2px solid var(--main-card-border); padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
.stats-group h2 .iconfont { margin-right: 0.8rem; }
.stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; text-align: center; }
.stat-card { background-color: var(--main-card-second-background); padding: 1.5rem; border-radius: 8px; }
.stat-card .value { font-size: 2.5rem; font-weight: bold; color: var(--main-color); }
.stat-card .label { margin-top: 0.5rem; color: var(--main-font-second-color); }
.stats-list { margin-top: 1rem; line-height: 1.8; }
.word-cloud { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1rem; }
.word-item { background-color: var(--main-card-border); padding: 5px 10px; border-radius: 5px; font-size: 0.9rem; }
.word-item sup { color: var(--main-color); font-weight: bold; }
.word-item.tag-item { background-color: var(--main-color-bg); color: var(--main-color); }
.punctuation-list { display: flex; flex-direction: column; gap: 1rem; }
.punc-item { display: grid; grid-template-columns: 30px 1fr 60px; align-items: center; gap: 1rem; }
.punc { font-size: 1.5rem; font-weight: bold; text-align: center; }
.punc-bar { height: 20px; background: linear-gradient(90deg, var(--main-color-bg) 0%, var(--main-color) 100%); border-radius: 4px; }
.count { font-size: 0.9rem; color: var(--main-font-second-color); }
</style>