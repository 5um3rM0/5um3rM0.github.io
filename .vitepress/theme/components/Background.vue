<template>
  <Teleport to="body">
    <!-- 站点背景 -->
    <div :class="['background', backgroundType, themeValue, { 'is-loading': isLoading }]">
      <!-- 自定义图片或自拍模式 -->
      <Transition name="fade-bg">
        <img
          v-if="(backgroundType === 'image' || backgroundType === 'selfie') && imageUrl"
          :key="imageUrl"
          :src="imageUrl"
          id="background-cover"
          class="cover"
          :style="{ objectFit: imageFit }"
          alt="background"
          @load="onImageLoad"
          @error="onImageError"
        />
      </Transition>
      <!-- 纹理背景 (由 class 控制) -->
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue';
import { storeToRefs } from "pinia";
import { mainStore } from "@/store";

const store = mainStore();
const { backgroundType, backgroundUrl, themeValue, imageFit } = storeToRefs(store);

const imageUrl = ref('');
const isLoading = ref(true); // 初始默认为加载中，进入“暗房”
let selfieInterval = null;

const onImageLoad = (e) => {
  e.target.classList.add("loaded");
  isLoading.value = false;
};

const onImageError = () => {
  if (imageUrl.value) {
    $message.error("背景图片加载失败");
  }
  imageUrl.value = '';
  isLoading.value = false;
};

// 获取要设置的图片 URL
const getImageUrl = (url) => {
  if (!url) return '';
  // 如果是 API 地址，添加时间戳以强制刷新
  if (url.includes('t.alcy.cc/fj')) {
    return `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
  }
  // 否则直接返回用户输入的 URL
  return url;
};

// 启动“5M自拍”模式
const startSelfieMode = async () => {
  try {
    const response = await fetch(`/selfie-list.json?t=${Date.now()}`);
    const selfieList = await response.json();
    if (!selfieList || selfieList.length === 0) return;

    let currentIndex = Math.floor(Math.random() * selfieList.length);
    const showNextSelfie = () => {
      isLoading.value = true;
      imageUrl.value = selfieList[currentIndex];
      currentIndex = (currentIndex + 1) % selfieList.length;
    };
    
    showNextSelfie();
    selfieInterval = setInterval(showNextSelfie, 10000);
  } catch (error) {
    console.error("Failed to load selfie list:", error);
  }
};

const stopSelfieMode = () => {
  if (selfieInterval) {
    clearInterval(selfieInterval);
    selfieInterval = null;
  }
};

// 监听器
watch(backgroundType, (newType) => {
  stopSelfieMode();
  if (newType === 'image') {
    isLoading.value = true;
    imageUrl.value = getImageUrl(backgroundUrl.value);
  } else if (newType === 'selfie') {
    startSelfieMode();
  } else {
    imageUrl.value = '';
    isLoading.value = false;
  }
}, { immediate: true });

watch(backgroundUrl, (newUrl) => {
  if (backgroundType.value === 'image') {
    isLoading.value = true;
    imageUrl.value = getImageUrl(newUrl);
  }
});

onUnmounted(() => {
  stopSelfieMode();
});
</script>

<style lang="scss" scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
  background-color: var(--main-site-background);
  transition: background-color 0.3s;

  &.is-loading {
    background-color: #18171d;
  }

  &.patterns {
    background-image: url("data:image/svg+xml,...(placeholder)...");
  }
  &.dark.patterns {
    background-image: url("data:image/svg+xml,...(placeholder)...");
  }
}

.cover {
  width: 100%;
  height: 100%;
  object-position: center;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  &.loaded {
    opacity: 1;
  }
}

.fade-bg-enter-active,
.fade-bg-leave-active {
  transition: opacity 0.8s ease;
}
.fade-bg-enter-from,
.fade-bg-leave-to {
  opacity: 0;
  position: absolute;
}
</style>