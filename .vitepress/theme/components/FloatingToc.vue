<!-- .vitepress/theme/components/FloatingToc.vue -->
<template>
  <div class="floating-toc-wrapper">
    <!-- 目录按钮 -->
    <div class="toc-button s-card" @click="toggleToc">
      <i class="iconfont icon-toc" />
    </div>

    <!-- 目录抽屉遮罩层 -->
    <div v-if="isOpen" class="toc-drawer-mask" @click="closeToc"></div>

    <!-- 目录抽屉面板 -->
    <div :class="['toc-drawer', { open: isOpen }]">
      <div class="drawer-header">
        <h3>文章目录</h3>
        <button class="close-btn" @click="closeToc">✖</button>
      </div>
      <div class="drawer-content" ref="tocContentRef">
        <!-- VitePress 目录内容将通过插槽注入 -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vitepress';

const isOpen = ref(false);
const tocContentRef = ref(null);
const route = useRoute();

const toggleToc = () => {
  isOpen.value = !isOpen.value;
  document.body.style.overflow = isOpen.value ? 'hidden' : '';
};

const closeToc = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
};

// 监听路由变化，切换文章时自动关闭目录
watch(() => route.path, () => {
  closeToc();
});

// 点击目录项后自动关闭抽屉
onMounted(() => {
  if (tocContentRef.value) {
    tocContentRef.value.addEventListener('click', (e) => {
      // 检查点击的是否是目录链接
      if (e.target.closest('a.outline-link')) {
        closeToc();
      }
    });
  }
});
</script>

<style lang="scss" scoped>
/* 这个组件只在特定屏幕宽度下显示 */
.floating-toc-wrapper {
  display: none; 
  position: fixed;
  right: 20px;
  bottom: 80px; /* 放在左侧设置按钮的上方 */
  z-index: 1001; /* 比左侧菜单低一点 */
}

/* 目录按钮样式 */
.toc-button {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 6px 10px -4px var(--main-dark-shadow);
  transition: all 0.3s;
  
  .iconfont {
    font-size: 22px;
  }

  &:hover {
    color: var(--main-card-background);
    background-color: var(--main-color);
    transform: scale(1.1);
  }
}

/* 抽屉遮罩层 */
.toc-drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1098; /* 比抽屉低 */
}

/* 抽屉面板 */
.toc-drawer {
  position: fixed;
  top: 0;
  right: -300px; /* 初始状态在屏幕外 */
  width: 300px;
  height: 100vh;
  background-color: var(--main-card-background);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1099;
  display: flex;
  flex-direction: column;

  &.open {
    right: 0; /* 打开时滑入屏幕 */
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--main-card-border);
    flex-shrink: 0;

    h3 {
      margin: 0;
      font-size: 1.2rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--main-font-second-color);
      &:hover {
        color: var(--main-color);
      }
    }
  }

  .drawer-content {
    padding: 1rem 1.5rem;
    overflow-y: auto;
    flex-grow: 1;

    // 深度选择器，用于设置 VitePress 生成的 TOC 样式
    :deep(.vp-outline) {
      .outline-title { display: none; } // 隐藏 VitePress 默认的“本页大纲”标题
      .outline-link {
        color: var(--main-font-second-color);
        &:hover {
          color: var(--main-color);
        }
      }
      .outline-link.active {
        color: var(--main-color);
        border-left-color: var(--main-color);
      }
    }
  }
}

/* 媒体查询：只在桌面端侧边栏消失时显示 */
@media (max-width: 1200px) {
  .floating-toc-wrapper {
    display: block;
  }
}
</style>