<template>
  <!-- 垂直进度条容器：固定在左侧，全屏高度 -->
  <div class="reading-progress-container">
    <!-- 进度条本体：高度随滚动百分比变化 -->
    <div 
      class="reading-progress-bar" 
      :style="{ transform: `scaleY(${progressPercentage / 100})`, opacity: progressPercentage > 0 ? 1 : 0 }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { mainStore } from '@/store';

// 1. 从 store 中获取滚动数据
const store = mainStore();
const { scrollData } = storeToRefs(store);

// 2. 使用计算属性直接响应 store 的变化，代码更简洁
const progressPercentage = computed(() => scrollData.value.percentage);

</script>

<style scoped>
.reading-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 4px;
  background-color: var(--main-card-border);
  z-index: 999;
  pointer-events: none;
  transition: background-color 0.3s;
}

.reading-progress-bar {
  width: 100%;
  height: 100%;
  background-color: var(--main-color);
  transform-origin: top center;
  transition: 
    transform 0.1s ease-out,
    opacity 0.3s;
}

@media (max-width: 768px) {
  .reading-progress-container {
    display: none;
  }
}
</style>