<template>
  <div class="floating-toc-wrapper">
    <div class="toc-button s-card" @click="toggleToc">
      <i class="iconfont icon-toc" />
    </div>
    <div v-if="isOpen" class="toc-drawer-mask" @click="closeToc"></div>
    <div :class="['toc-drawer', { open: isOpen }]">
      <div class="drawer-header">
        <h3>文章目录</h3>
        <button class="close-btn" @click="closeToc">✖</button>
      </div>
      <div class="drawer-content" ref="tocContentRef">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vitepress';

const isOpen = ref(false);
const tocContentRef = ref(null);
const route = useRoute();
const toggleToc = () => { /* ... */ };
const closeToc = () => { /* ... */ };
watch(() => route.path, () => { closeToc(); });
onMounted(() => { /* ... */ });
</script>

<style lang="scss" scoped>
</style>