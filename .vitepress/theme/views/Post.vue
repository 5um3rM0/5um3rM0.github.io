<!-- 文章页面 -->
<template>
  <div v-if="isPrivate && !isAuthenticated" class="password-gate s-card">
    <h2>🔒 这里是5M的小秘密</h2>
    <p>请输入访问密码：</p>
    <input v-model="passwordInput" type="password" @keyup.enter="checkPassword" />
    <button @click="checkPassword">确认</button>
    <p v-if="passwordError" class="error-tip">不好意思，错了</p>
  </div>
  <div v-if="postMetaData && !isPrivate || isAuthenticated" class="post">
    <div v-if="postMetaData" class="post">
      <div class="post-meta">
        <div class="meta">
          <div class="categories">
            <a v-for="(item, index) in postMetaData.categories" :key="index" :href="`/pages/categories/${item}`"
              class="cat-item">
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
        <h1 class="title">
          {{ postMetaData.title || "未命名文章" }}
        </h1>
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
      <div class="post-content">
        <article class="post-article s-card">
          <!-- 过期提醒 -->
          <div class="expired s-card" v-if="postMetaData?.expired >= 180">
            本文发表于 <strong>{{ postMetaData?.expired }}</strong> 天前，注意时效性哦
          </div>
          <!-- AI 摘要 -->
          <ArticleGPT />
          <!-- 文章内容 -->
          <Content id="page-content" class="markdown-main-style" />
          <!-- 版权 -->
          <Copyright v-if="frontmatter.copyright !== false" :postData="postMetaData" />
          <!-- 其他信息 -->
          <div class="other-meta">
            <div class="all-tags">
              <a v-for="(item, index) in postMetaData.tags" :key="index" :href="`/pages/tags/${item}`" class="tag-item">
                <i class="iconfont icon-hashtag" />
                <span class="name">{{ item }}</span>
              </a>
            </div>
            <a href="https://www.aceshowbiz.com/images/still/drive02.jpg" class="report" target="_blank">
              <i class="iconfont icon-report" />
              反馈与投诉
            </a>
          </div>
          <RewardBtn />
          <!-- 下一篇 -->
          <NextPost />
          <!-- 相关文章 -->
          <RelatedPost />
          <!-- 评论 -->
          <Comments ref="commentRef" />
        </article>
        <Aside showToc />
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatTimestamp } from "@/utils/helper";
import { generateId } from "@/utils/commonTools";
import initFancybox from "@/utils/initFancybox";

const { page, theme, frontmatter } = useData();

const isPrivate = computed(() => {
  return frontmatter.value.categories?.includes('和TA的日常');
});

const isAuthenticated = ref(false); // 验证状态
const passwordInput = ref('');     // 输入的密码
const passwordError = ref(false);  // 密码错误提示

// 你可以把密码设置得更复杂一些
const correctPassword = 'ak_20250828';

const checkPassword = () => {
  if (passwordInput.value === correctPassword) {
    isAuthenticated.value = true;
    passwordError.value = false;
    sessionStorage.setItem('post_auth', 'true');
  } else {
    passwordError.value = true;
  }
};

// 评论元素
const commentRef = ref(null);

// 获取对应文章数据
const postMetaData = computed(() => {
  const postId = generateId(page.value.relativePath);
  return theme.value.postData.find((item) => item.id === postId);
});

onMounted(() => {
  if (isPrivate.value && sessionStorage.getItem('post_auth') === 'true') {
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

        &.hot {
          .iconfont {
            font-size: 18px;
          }
        }

        &.hover {
          transition:
            color 0.3s,
            background-color 0.3s;
          cursor: pointer;

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

      .expired {
        margin: 1.2rem 0 2rem 0;
        padding: 0.8rem 1.2rem;
        border-left: 6px solid var(--main-warning-color);
        border-radius: 6px 16px 16px 6px;
        user-select: none;

        strong {
          color: var(--main-warning-color);
        }
      }

      .other-meta {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 2rem 0;
        opacity: 0.8;

        .all-tags {
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
            background-color: var(--main-card-border);
            margin-right: 12px;

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

        .report {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 6px 12px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 8px;
          background-color: var(--main-card-border);

          .iconfont {
            margin-right: 6px;
          }

          &:hover {
            color: #efefef;
            background-color: var(--main-error-color);

            .iconfont {
              color: #efefef;
            }
          }
        }
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

        .other-meta {
          margin: 1rem 0 2rem 0;
          flex-direction: column;

          .all-tags {
            flex-wrap: wrap;

            .tag-item {
              margin-top: 12px;
            }
          }

          .report {
            margin-top: 20px;
          }
        }
      }
    }
  }
}

.password-gate {
  max-width: 600px;
  margin: 100px auto;
  padding: 2rem 2.5rem !important;
  text-align: center;

  input {
    width: 80%;
    padding: 10px;
    margin: 1rem 0;
    border: 1px solid var(--main-card-border);
    border-radius: 8px;
    background-color: var(--main-card-second-background);
    color: var(--main-font-color);
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: var(--main-color);
    color: white;
    cursor: pointer;
  }

  .error-tip {
    color: var(--main-error-color);
    margin-top: 1rem;
  }
}
</style>