<template>
  <div class="site-data s-card">
    <div class="title">
      <i class="iconfont icon-chart"></i>
      <span class="title-name">站点数据</span>
    </div>
    <div class="all-data">
      <!-- 其他数据项（文章总数、建站天数等，这些是静态的，无需 ClientOnly） -->
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-article"></i>
          文章总数
        </span>
        <span class="num">{{ articleCount }} 篇</span>
      </div>
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-date"></i>
          建站天数
        </span>
        <span class="num">{{ runningDays || '未知' }} 天</span>
      </div>
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-time"></i>
          最后更新
        </span>
        <span class="num">{{ lastUpdatedText }}</span>
      </div>
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-star"></i>
          全站字数
        </span>
        <span class="num">{{ formattedWordCount }}</span>
      </div>

      <!-- 关键：用 ClientOnly 包裹访问量相关的动态内容 -->
      <ClientOnly>
        <template #fallback>
          <!-- 服务器预渲染时显示的占位内容（避免空白） -->
          <div class="data-item">
            <span class="name"><i class="iconfont icon-visibility"></i>总访问量</span>
            <span class="num">加载中...</span>
          </div>
          <div class="data-item">
            <span class="name"><i class="iconfont icon-account"></i>总访客数</span>
            <span class="num">加载中...</span>
          </div>
        </template>

        <!-- 客户端渲染的实际内容 -->
        <div class="data-item">
          <span class="name">
            <i class="iconfont icon-visibility"></i>
            总访问量
          </span>
          <span class="num">
            <template v-if="scriptLoadStatus === 'loading'">获取中...</template>
            <template v-else-if="scriptLoadStatus === 'error'">获取失败</template>
            <template v-else>
              <span id="busuanzi_value_site_pv">--</span>
            </template>
          </span>
        </div>
        <div class="data-item">
          <span class="name">
            <i class="iconfont icon-account"></i>
            总访客数
          </span>
          <span class="num">
            <template v-if="scriptLoadStatus === 'loading'">获取中...</template>
            <template v-else-if="scriptLoadStatus === 'error'">获取失败</template>
            <template v-else>
              <span id="busuanzi_value_site_uv">--</span>
            </template>
          </span>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useData } from 'vitepress'; // 导入 ClientOnly 组件
import { daysFromNow } from '@/utils/helper';

const scriptLoadStatus = ref('loading');
const { theme } = useData();

// 文章总数
const articleCount = computed(() => {
  return theme.value.postData?.length || 0;
});

// 建站天数
const runningDays = computed(() => {
  if (!theme.value.since) return null; // 若未配置建站日期，返回null
  try {
    return daysFromNow(theme.value.since); // 调用工具函数计算天数
  } catch (error) {
    console.error('建站天数计算失败:', error);
    return null;
  }
});

// 忽略置顶，按时间排序
const latestPost = computed(() => {
  if (!theme.value.postData || theme.value.postData.length === 0) {
    return null; // 无文章数据时返回null
  }

  // 复制postData数组（避免修改原数组），按“修改时间优先 > 发布时间”降序排序
  const sortedPosts = [...theme.value.postData].sort((a, b) => {
    // 取每篇文章的“最新时间”：优先用lastModified（文件修改时间），无则用date（发布时间）
    const timeA = a.lastModified || a.date;
    const timeB = b.lastModified || b.date;
    // 时间戳降序：数值越大越新，确保最新文章排在第一位
    return timeB - timeA;
  });

  // 返回排序后的第一篇（真正的最新文章）
  return sortedPosts[0];
});

// 最后更新时间
const lastUpdatedText = computed(() => {
  const post = latestPost.value;
  if (!post) return '暂无数据'; // 无文章时显示

  // 解析最新文章的时间（处理时间戳/日期字符串两种格式）
  const postTime = new Date(post.lastModified || post.date);
  if (isNaN(postTime.getTime())) return '日期格式错误'; // 日期无效时容错

  // 统一时间精度：只比较“日期”（忽略时分秒）
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 今天的0点0分0秒
  const postDate = new Date(postTime);
  postDate.setHours(0, 0, 0, 0); // 文章时间的0点0分0秒

  // 计算天数差
  const diffInDays = Math.floor((today - postDate) / (1000 * 60 * 60 * 24));

  // 按天级别显示逻辑
  if (diffInDays === 0) return '今天';
  if (diffInDays === 1) return '昨天';
  if (diffInDays < 30) return `${diffInDays} 天前`;
  // 超过30天：显示具体日期（如“2024年9月6日”）
  return postDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// 全站字数
const formattedWordCount = computed(() => {
  const count = theme.value.siteStats?.totalWordCount || 0;
  if (count > 10000) return `${(count / 10000).toFixed(1)} 万`;
  if (count > 1000) return `${(count / 1000).toFixed(1)} 千`;
  return `${count}`;
});

onMounted(() => {
  // 现在日志应该能输出了（水合错误解决后，onMounted 正常执行）
  console.log('[SiteData] 组件挂载完成，开始加载不蒜子');

  // 不蒜子加载逻辑（使用之前的回调监听方式）
  const script = document.createElement('script');
  script.src = `https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js?t=${Date.now()}`;
  script.async = true;
  document.head.appendChild(script);

  // 监听不蒜子的 JSONP 回调
  window.BusuanziCallback = function (data) {
    console.log('[不蒜子] 数据回调:', data);
    if (data?.site_pv !== undefined && data?.site_uv !== undefined) {
      scriptLoadStatus.value = 'success';
      // 手动更新 DOM
      document.getElementById('busuanzi_value_site_pv').textContent = data.site_pv;
      document.getElementById('busuanzi_value_site_uv').textContent = data.site_uv;
    } else {
      scriptLoadStatus.value = 'error';
    }
  };

  // 超时兜底
  setTimeout(() => {
    if (scriptLoadStatus.value === 'loading') {
      scriptLoadStatus.value = 'error';
      console.log('[不蒜子] 超时未加载');
    }
  }, 10000);
});
</script>

<style lang="scss" scoped>
.site-data {
  // 标题样式
  .title {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    height: 40px;
    .iconfont {
      margin-right: 8px;
      color: var(--main-color); // 图标颜色适配主题
    }
    .title-name {
      font-weight: bold;
      font-size: 16px;
      color: var(--main-font-color);
    }
  }

  // 数据列表样式
  .all-data {
    padding: 0.5rem 1rem 1rem;
    .data-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0.2rem;
      font-size: 15px;
      border-bottom: 1px solid var(--main-card-border); // 分隔线

      // 数据名称（如“文章总数”）
      .name {
        display: flex;
        align-items: center;
        color: var(--main-font-second-color); // 次要文字颜色
        .iconfont {
          margin-right: 8px;
          opacity: 0.8;
          font-size: 16px;
        }
      }

      // 数据值（如“10 篇”）
      .num {
        font-weight: bold;
        color: var(--main-font-color);

        // 加载中状态样式
        &:has(> [v-if="scriptLoadStatus === 'loading'"]) {
          color: #666;
          font-weight: normal;
        }

        // 加载失败状态样式
        &:has(> [v-else-if="scriptLoadStatus === 'error'"]) {
          color: #ff4d4f; // 错误颜色
          font-weight: normal;
        }
      }

      :deep(#busuanzi_value_site_pv) {
        &::after {
          content: ' 次';
          color: var(--main-font-color);
        }
      }
      :deep(#busuanzi_value_site_uv) {
        &::after {
          content: ' 人';
          color: var(--main-font-color);
        }
      }
    }

    .data-item:last-child {
      border-bottom: none;
    }
  }

  // 响应式：小屏幕适配
  @media (max-width: 768px) {
    .all-data {
      .data-item {
        font-size: 14px;
        padding: 8px 0.2rem;

        .name .iconfont {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
