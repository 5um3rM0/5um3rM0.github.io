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
        <span class="num">{{ runningDays }} 天</span>
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
        <span class="num" id="busuanzi_value_site_pv"></span>
      </div>
      <div class="data-item">
        <span class="name">
          <i class="iconfont icon-account"></i>
          总访客数
        </span>
        <span class="num" id="busuanzi_value_site_uv"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import { loadScript } from "@/utils/commonTools";
import { daysFromNow } from "@/utils/helper";

const { theme } = useData();

const articleCount = computed(() => theme.value.postData?.length || 0);

const runningDays = computed(() => daysFromNow(theme.value.since));

onMounted(() => {
  loadScript("https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js", {
    async: true,
  });
});

const lastUpdatedText = computed(() => {
  if (!theme.value.postData || theme.value.postData.length === 0) {
    return '暂无';
  }
  const lastPostDate = new Date(theme.value.postData[0].date);
  const diffInMinutes = Math.floor((new Date() - lastPostDate) / 60000);

  if (diffInMinutes < 60) return `${diffInMinutes} 分钟前`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} 小时前`;
  const diffInDays = Math.floor(diffInHours / 24);
  return diffInDays === 1 ? '昨天' : `${diffInDays} 天前`;
});

const formattedWordCount = computed(() => {
  const count = theme.value.siteStats?.totalWordCount || 0;
  if (count > 10000) {
    return `${(count / 10000).toFixed(1)} 万`;
  }
  if (count > 1000) {
    return `${(count / 1000).toFixed(1)} 千`;
  }
  return `${count}`;
});
</script>

<style lang="scss" scoped>
.site-data {
  .title {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    height: 40px;
    .iconfont { margin-right: 8px; }
    .title-name { font-weight: bold; }
  }
  .all-data {
    padding: 0 1rem 0.5rem;
    .data-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0.2rem;
      font-size: 15px;
      .name {
        display: flex;
        flex-direction: row;
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
      #busuanzi_value_site_pv {
        &::after {
          content: " 次";
        }
      }
      #busuanzi_value_site_uv {
        &::after {
          content: " 人";
        }
      }
    }
  }
}
</style>