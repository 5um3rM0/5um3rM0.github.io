<template>
  <div class="site-data s-card">
    <div class="title">
      <i class="iconfont icon-chart"></i>
      <span class="title-name">站点数据</span>
    </div>
    <div class="all-data">
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
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-visibility"></i>
          总访问量
        </span>
        <span class="num" id="busuanzi_value_site_pv">0</span>
      </div>
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-account"></i>
          总访客数
        </span>
        <span class="num" id="busuanzi_value_site_uv">0</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useData } from 'vitepress';
import { loadScript } from '@/utils/commonTools';
import { daysFromNow } from '@/utils/helper';

const { theme } = useData();

const articleCount = computed(() => theme.value.postData?.length || 0);

const runningDays = computed(() => {
  if (!theme.value.since) return null;
  try {
    return daysFromNow(theme.value.since);
  } catch (e) {
    return null;
  }
});

const lastUpdatedText = computed(() => {
  if (!theme.value.postData || theme.value.postData.length === 0) return '暂无数据';
  const sortedPosts = [...theme.value.postData].sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastDate = new Date(sortedPosts[0].date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? '今天' : diffDays === 1 ? '昨天' : `${diffDays} 天前`;
});

const formattedWordCount = computed(() => {
  const count = theme.value.siteStats?.totalWordCount || 0;
  if (count > 10000) return `${(count / 10000).toFixed(1)} 万`;
  if (count > 1000) return `${(count / 1000).toFixed(1)} 千`;
  return `${count}`;
});

onMounted(() => {
  loadScript('https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js', {
    async: true,
    reload: true,
  });
});
</script>

<style lang="scss" scoped>
.site-data {
  .title {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    height: 40px;
    .iconfont {
      margin-right: 8px;
    }
    .title-name {
      font-weight: bold;
    }
  }
  .all-data {
    padding: 0 1rem 0.5rem;
    .data-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem 0.2rem;
      font-size: 15px;
      border-bottom: 1px solid var(--main-card-border);

      &:last-child {
        border-bottom: none;
      }

      .name {
        display: flex;
        align-items: center;
        color: var(--main-font-second-color);
        .iconfont {
          margin-right: 8px;
          opacity: 0.8;
          font-size: 16px;
        }
      }

      .num {
        font-weight: bold;
      }

      :deep(#busuanzi_value_site_pv) {
        &::after {
          content: ' 次';
        }
      }

      :deep(#busuanzi_value_site_uv) {
        &::after {
          content: ' 人';
        }
      }
    }
  }
}
</style>
