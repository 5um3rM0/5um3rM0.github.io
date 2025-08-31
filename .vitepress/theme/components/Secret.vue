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
          <input
            v-model="passwordInput"
            type="password"
            placeholder="请输入访问密钥..."
            @keyup.enter="checkPassword"
          />
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
        <div class="main-aside">
          <Aside showToc />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useData } from "vitepress";
import { formatTimestamp } from "@/utils/helper";
import { generateId } from "@/utils/commonTools";
import initFancybox from "@/utils/initFancybox";
import Aside from "@/components/Aside/index.vue";
import ArticleGPT from "@/components/Aside/Widgets/ArticleGPT.vue";

const { page, theme, frontmatter } = useData();

const isAuthenticated = ref(false);
const passwordInput = ref("");
const passwordError = ref(false);
const correctPassword = "ak_20250828";

const checkPassword = () => {
  if (passwordInput.value === correctPassword) {
    isAuthenticated.value = true;
    passwordError.value = false;
    sessionStorage.setItem("secret_auth_token", "granted");
  } else {
    passwordError.value = true;
  }
};

const postMetaData = computed(() => {
  const isPost = page.value.filePath.startsWith("posts/");
  if (!isPost) return null;
  const postId = generateId(page.value.relativePath);
  return theme.value.postData.find((item) => item.id === postId);
});

onMounted(() => {
  if (sessionStorage.getItem("secret_auth_token") === "granted") {
    isAuthenticated.value = true;
  }
  initFancybox(theme.value);
});
</script>

<style lang="scss" scoped>
@use "../style/post.scss";

.post {
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: fade-up 0.6s 0.1s backwards;

  .post-meta {
    padding: 2rem 0 3rem 18px;
    width: 100%;

    .meta {
      display: flex;
      flex-direction: row;
      align-items: center;

      .categories {
        margin-right: 12px;

        .cat-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 6px 12px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 8px;
          background-color: var(--main-mask-Inverse-background);
          opacity: 0.8;

          .iconfont {
            margin-right: 6px;
          }

          &:hover {
            color: var(--main-color);
            background-color: var(--main-color-bg);

            .iconfont {
              color: var(--main-color);
            }
          }
        }
      }

      .tags {
        display: flex;
        flex-direction: row;
        align-items: center;

        .tag-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 6px 12px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 8px;
          opacity: 0.8;

          .iconfont {
            margin-right: 4px;
            opacity: 0.6;
            font-weight: normal;
          }

          &:hover {
            color: var(--main-color);
            background-color: var(--main-color-bg);

            .iconfont {
              color: var(--main-color);
            }
          }
        }
      }
    }

    .title {
      font-size: 2.2rem;
      line-height: 1.2;
      color: var(--main-font-color);
      margin: 1.4rem 0;
    }

    .other-meta {
      display: flex;
      flex-direction: row;
      align-items: center;

      .meta {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 6px 12px;
        font-size: 14px;
        border-radius: 8px;
        opacity: 0.8;

        .iconfont {
          margin-right: 6px;
          transition: color 0.3s;
        }

        &.date {
          padding-left: 0;
        }
      }
    }
  }

  .post-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    animation: fade-up 0.6s 0.3s backwards;

    .post-article {
      width: calc(100% - 300px);
      padding: 1rem 2.2rem 2.2rem 2.2rem;
      user-select: text;
      cursor: auto;

      &:hover {
        border-color: var(--main-card-border);
      }
    }

    .main-aside {
      width: 300px;
      padding-left: 1rem;
    }

    @media (max-width: 1200px) {
      .post-article {
        width: 100%;
      }

      .main-aside {
        display: none;
      }
    }
  }

  @media (max-width: 768px) {
    .post-meta {
      padding: 4rem 1.5rem;

      .meta {
        justify-content: center;

        .categories {
          margin-right: 0;
        }

        .tags {
          display: none;
        }
      }

      .title {
        font-size: 1.6rem;
        text-align: center;
        line-height: 40px;
      }

      .other-meta {
        justify-content: center;
      }
    }

    .post-content {
      .post-article {
        border: none;
        padding: 20px 30px;
      }
    }
  }
}

.secret-layout,
.post {
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
    font-family: "SimSun", "宋体", serif;
    font-weight: bold;
    text-align: left;
  }

  .content {
    padding: 2rem 2.5rem;
    text-align: center;
    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      color: var(--main-font-second-color);
    }
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
