<template>
  <div v-if="postMetaData" class="post">
    <div class="post-meta">
      <div class="meta">
        <div class="categories">
          <a
            v-for="(item, index) in postMetaData.categories"
            :key="index"
            :href="`/pages/categories/${item}`"
            class="cat-item"
          >
            <i class="iconfont icon-folder" />
            <span class="name">{{ item }}</span>
          </a>
        </div>
        <div class="tags">
          <a
            v-for="(item, index) in postMetaData.tags"
            :key="index"
            :href="`/pages/tags/${item}`"
            class="tag-item"
          >
            <i class="iconfont icon-hashtag" />
            <span class="name">{{ item }}</span>
          </a>
        </div>
      </div>
      <h1 class="title">
        {{ postMetaData.title || "未命名文章" }}
      </h1>
      <div class="other-meta">
        <span class="meta date">
          <i class="iconfont icon-date" />
          {{ formatTimestamp(postMetaData.date) }}
        </span>
        <ReadTime 
          class="meta read-time" 
          :readTime="readTime" 
          :wordCount="wordCount" 
        />
        <span class="update meta">
          <i class="iconfont icon-time" />
          {{ formatTimestamp(page?.lastUpdated || postMetaData.lastModified) }}
        </span>
      </div>
    </div>
    <div class="post-content">
      <article class="post-article s-card">
        <div class="expired s-card" v-if="postMetaData?.expired >= 180">
          本文发表于 <strong>{{ postMetaData?.expired }}</strong> 天前，注意时效性哦
        </div>
        <ArticleGPT />
        <Content id="page-content" class="markdown-main-style" />
        <References />
        <Copyright v-if="frontmatter.copyright !== false" :postData="postMetaData" />
        <div class="other-meta">
          <a
            href="https://www.aceshowbiz.com/images/still/drive02.jpg"
            class="report"
            target="_blank"
          >
            <i class="iconfont icon-report" />
            反馈与投诉
          </a>
        </div>
        <NextPost />
        <RelatedPost />
        <Comments ref="commentRef" />
      </article>
      <Aside showToc />
    </div>
  </div>
</template>

<script setup>
import { formatTimestamp } from "@/utils/helper";
import { generateId } from "@/utils/commonTools";
import initFancybox from "@/utils/initFancybox";
import ReadTime from "@/components/ReadTime.vue";
import { calculateReadTime } from '@/utils/readTime';

const { page, theme, frontmatter } = useData();

const commentRef = ref(null);

const postMetaData = computed(() => {
  const postId = generateId(page.value.relativePath);
  return theme.value.postData.find((item) => item.id === postId);
});

const readTime = ref(1);
const wordCount = ref(0);

onMounted(() => {
  initFancybox(theme.value);
  const contentElement = document.querySelector('#page-content');
  if (contentElement) {
    const clonedElement = contentElement.cloneNode(true);
    clonedElement.querySelectorAll('pre').forEach(pre => pre.remove());
    const articleContent = clonedElement.textContent || '';
    const { readTime: rt, wordCount: wc } = calculateReadTime(articleContent);
    readTime.value = rt;
    wordCount.value = wc;
  }
});
</script>

<style lang="scss" scoped>
@use "../style/post.scss";

.post-content .post-article .other-meta {
  justify-content: flex-end;
}
@media (max-width: 768px) {
  .post-content .post-article .other-meta {
    justify-content: center;
  }
}
</style>