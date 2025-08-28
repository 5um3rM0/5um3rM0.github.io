<template>
  <span class="meta read-time">
    <i class="iconfont icon-clock" /> <!-- 复用主题的 iconfont 图标 -->
    <span class="read-time-text">阅读时间：{{ readTime }} 分钟</span>
    <span class="read-time-split">|</span>
    <span class="word-count-text">字数：{{ wordCount.toLocaleString() }}</span>
  </span>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  readTime: { type: Number, required: true, default: 1 },
  wordCount: { type: Number, required: true, default: 0 }
});
</script>

<style scoped>
/* 完全复用 Post.vue 中 .meta 类的样式，仅补充细节 */
.read-time {
  /* 继承 .meta 的样式（padding、font-size 等已在 Post.vue 定义）*/
  display: flex;
  align-items: center;
  gap: 0.4rem; /* 图标与文字、文字与分隔符的间距 */
  opacity: 0.8; /* 与其他元信息保持一致的透明度 */
  transition: all 0.3s; /*  hover 动画同步 */
}

/* 图标样式：与其他元信息图标一致 */
.read-time .iconfont {
  margin-right: 6px; /* 参考 date 元信息的图标间距 */
  transition: color 0.3s;
}

/* 分隔符样式：淡色，避免抢镜 */
.read-time-split {
  color: var(--main-card-border); /* 复用主题边框色，与其他分隔符一致 */
}

/* hover 效果：与其他元信息同步（如 chat 元信息的 hover 逻辑）*/
.read-time:hover {
  color: var(--main-color);
  background-color: var(--main-color-bg);
  .iconfont {
    color: var(--main-color);
  }
}

/* 移动端适配：跟随 Post.vue 的响应式逻辑 */
@media (max-width: 768px) {
  .read-time {
    gap: 0.3rem;
    font-size: 13px; /* 移动端字体稍小，节省空间 */
  }
  .read-time-text, .word-count-text {
    white-space: nowrap; /* 避免换行导致错乱 */
  }
}
</style>