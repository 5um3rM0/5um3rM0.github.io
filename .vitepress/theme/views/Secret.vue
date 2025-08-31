<template>
  <div class="secret-layout">
    <!-- 密码保护界面 -->
    <div v-if="!isAuthenticated" class="password-gate-container">
      <div class="password-gate s-card">
        <div class="header">
          <span class="classification">机密 ★ 长期</span>
        </div>
        <div class="content">
          <h2>访问受限区域</h2>
          <p>此档案已被加密，请输入授权密码以继续访问。</p>
          <input v-model="passwordInput" type="password" placeholder="请输入访问密钥..." @keyup.enter="checkPassword" />
          <button @click="checkPassword">授权验证</button>
          <p v-if="passwordError" class="error-tip">错误：访问密钥无效</p>
        </div>
      </div>
    </div>

    <!-- 解锁后的内容 -->
    <div v-else class="post">
      <!-- 渲染头部元信息 -->
      <div v-if="postMetaData" class="post-meta">
        <div class="meta">
          <div class="categories">
            <a v-for="(item, index) in postMetaData.categories" :key="index" :href="`/pages/categories/${item}`" class="cat-item">
              <i class="iconfont icon-folder" />
              <span class="name">{{ item }}</span>
            </a>
          </div>
          <div class="tags">
            <a v-for="(item, index) in postMetaData.tags" :key="index" :href="`/pages/tags/${item}`" class="tag-item">
              <i class="iconfont icon-hashtag" />
              <span class="name">{{ item }}</span>
            </a>
          </div>
        </div>
        <h1 class="title">{{ postMetaData.title || "未命名文章" }}</h1>
        <div class="other-meta">
          <span class="meta date">
            <i class="iconfont icon-date" />
            {{ formatTimestamp(postMetaData.date) }}
          </span>
          <span class="update meta">
            <i class="iconfont icon-time" />
            {{ formatTimestamp(page?.lastUpdated || postMetaData.lastModified) }}
          </span>
        </div>
      </div>
      <!-- 对于没有元数据的页面 (比如 /pages/ 下的页面)，也提供一个标题 -->
      <div v-else class="post-meta">
          <h1 class="title">{{ frontmatter.title || "秘密档案" }}</h1>
      </div>

      <!-- 渲染正文内容 -->
      <div class="post-content">
        <article class="post-article s-card">
          <ArticleGPT v-if="frontmatter.articleGPT" />
          <Content id="page-content" class="markdown-main-style" />
          <!-- 秘密文章不显示版权、推荐和下一篇等社交组件 -->
        </article>
        <Aside showToc />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useData } from 'vitepress';
import { formatTimestamp } from "@/utils/helper";
import { generateId } from "@/utils/commonTools";
import initFancybox from "@/utils/initFancybox";
import Aside from '@/components/Aside/index.vue';
import ArticleGPT from '@/components/ArticleGPT.vue';

const { page, theme, frontmatter } = useData();

const isAuthenticated = ref(false);
const passwordInput = ref('');
const passwordError = ref(false);
const correctPassword = 'ak_20250828';

const checkPassword = () => {
  if (passwordInput.value === correctPassword) {
    isAuthenticated.value = true;
    passwordError.value = false;
    sessionStorage.setItem('secret_auth_token', 'granted');
  } else {
    passwordError.value = true;
  }
};

const postMetaData = computed(() => {
  const isPost = page.value.filePath.startsWith('posts/');
  if (!isPost) return null;
  const postId = generateId(page.value.relativePath);
  return theme.value.postData.find((item) => item.id === postId);
});

onMounted(() => {
  if (sessionStorage.getItem('secret_auth_token') === 'granted') {
    isAuthenticated.value = true;
  }
  initFancybox(theme.value);
});
</script>

<style lang="scss" scoped>
@use "../style/post.scss";

.secret-layout, .post {
  padding-top: 5vh;
}

.password-gate-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
}

.password-gate {
  width: 100%;
  max-width: 550px;
  border: 1px solid var(--main-warning-color);
  box-shadow: 0 0 20px var(--main-warning-color-gray);
  animation: fade-up 0.5s;
  padding: 0 !important;
  overflow: hidden;

  .header {
    background-color: var(--main-warning-color);
    color: white;
    padding: 8px 16px;
    font-family: 'SimSun', '宋体', serif;
    font-weight: bold;
    text-align: left;
  }

  .content {
    padding: 2rem 2.5rem;
    text-align: center;
    h2 { font-size: 1.5rem; margin-bottom: 1rem; }
    p { color: var(--main-font-second-color); }
    input {
      width: 100%;
      padding: 12px;
      margin: 1.5rem 0;
      border: 1px solid var(--main-card-border);
      border-radius: 4px;
      background-color: var(--main-card-second-background);
      color: var(--main-font-color);
      font-size: 1rem;
    }
    button {
      width: 100%;
      padding: 12px 20px;
      border: none;
      border-radius: 4px;
      background-color: var(--main-color);
      color: white;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: background-color 0.3s;
      &:hover {
        filter: brightness(1.1);
      }
    }
    .error-tip {
      color: var(--main-error-color);
      margin-top: 1rem;
      font-weight: bold;
    }
  }
}
</style>