<!-- .vitepress/theme/components/Aside/Widgets/Hello.vue (带随机旗帜版) -->
<template>
  <div v-if="authorInfo" class="hello s-card">
    <span class="tip" @click="changeHello">{{ helloText }}</span>
    <div class="content">
      <div class="site-logo">
        <!-- 随机旗帜背景 -->
        <div class="flag-background" :style="{ backgroundImage: `url(${randomFlagUrl})` }"></div>
        <!-- 透明底头像 -->
        <img :src="authorInfo.avatar" alt="博主头像" class="avatar">
      </div>
      <div class="personal-info">
        <h3 class="name">{{ authorInfo.name }}</h3>
        <p class="subtitle">{{ authorInfo.subtitle }}</p>
        <div class="socials">
          <a v-for="social in authorInfo.socials" :key="social.name" :href="social.url" class="social-link" target="_blank">
            <i :class="['iconfont', `icon-${social.icon}`]"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getGreetings } from "@/utils/helper";

// 定义博主信息
const authorInfo = {
  name: '5um3rM0',
  subtitle: 'Just for fun.',
  avatar: '/images/avatar.png',
  socials: [
    { name: 'GitHub', icon: 'github', url: 'https://github.com/5um3rM0/' },
    { name: 'Email', icon: 'mail', url: 'mailto:n.reed2000@outlook.com' },
  ]
};

// 随机旗帜逻辑
const flags = [
  '/images/flags/flag (1).jpg',
  '/images/flags/flag (1).png',
  '/images/flags/flag (1).svg',
  '/images/flags/flag (1).webp',
  '/images/flags/flag (2).png',
  '/images/flags/flag (2).svg',
  '/images/flags/flag (3).png',
  '/images/flags/flag (3).svg',
  '/images/flags/flag (4).png',
  '/images/flags/flag (4).svg',
  '/images/flags/flag (5).png',
  '/images/flags/flag (5).svg',
  '/images/flags/flag (6).svg',
  '/images/flags/flag (7).svg',
  '/images/flags/flag (8).svg',
  '/images/flags/flag (9).svg',
  '/images/flags/flag (10).svg',
  '/images/flags/flag (11).svg',
  '/images/flags/flag (12).svg',
  '/images/flags/flag (13).svg',
  '/images/flags/flag (14).svg',
  '/images/flags/flag (15).svg',
  '/images/flags/flag (16).svg',
];
const randomFlagUrl = ref('');

// 问候语彩蛋逻辑
const helloClick = ref(0);
const helloTimeOut = ref(null);
const helloText = ref(getGreetings());

const resetHello = () => {
  helloClick.value = 0;
  if (isHasUser()) return false;
  helloText.value = getGreetings();
};

const changeHello = () => {
  clearTimeout(helloTimeOut.value);
  helloClick.value++;
  if (helloClick.value === 1) helloText.value = "点这里干什么？";
  else if (helloClick.value === 2) helloText.value = "怎么还点？";
  else if (helloClick.value === 3) helloText.value = "那你点吧！";
  else if (helloClick.value === 100) helloText.value = "怎么还在点？？？";
  else helloText.value = `x ${helloClick.value - 3}`;
  helloTimeOut.value = setTimeout(() => { resetHello(); }, 3000);
};

const isHasUser = () => {
  if (typeof window === 'undefined') return false;
  const userData = localStorage.getItem("ArtalkUser");
  if (!userData) return false;
  const { nick } = JSON.parse(userData);
  const hello = ["很高兴见到你", "好久不见", "欢迎回来"];
  helloText.value = hello[Math.floor(Math.random() * hello.length)] + "，" + nick;
  return true;
};

onMounted(() => {
  // 随机选择一面旗帜
  randomFlagUrl.value = flags[Math.floor(Math.random() * flags.length)];
  
  // 检查Artalk用户
  isHasUser();
});

onBeforeUnmount(() => {
  clearTimeout(helloTimeOut.value);
});
</script>

<style lang="scss" scoped>
.hello {
  padding: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  .tip {
    display: inline-block;
    min-width: 140px;
    text-align: center;
    padding: 6px 12px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: bold;
    background-color: var(--main-card-second-background);
    color: var(--main-font-color);
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      transform: scale(1.05);
      background-color: var(--main-color);
      color: #fff;
    }
  }
  
  .content {
    width: 100%;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .site-logo {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    transition: all 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045);
    /* 让头像和旗帜在3D空间中 */
    transform-style: preserve-3d;
    
    .avatar {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .flag-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      z-index: 1;
      /* 初始状态缩小 */
      transform: scale(0.8);
      opacity: 0.8;
      transition: all 0.4s ease-in-out;
    }
  }

  .personal-info {
    position: absolute;
    bottom: -100px;
    left: 0;
    width: 100%;
    padding: 1rem;
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    .name { font-size: 1.5rem; font-weight: bold; margin: 0; }
    .subtitle { font-size: 0.9rem; color: var(--main-font-second-color); margin: 0.5rem 0 1rem 0; }
    .socials {
      display: flex;
      justify-content: center;
      gap: 1.2rem;
      .social-link {
        color: var(--main-font-color);
        .iconfont { font-size: 1.5rem; }
        &:hover { color: var(--main-color); transform: scale(1.1); }
      }
    }
  }

  /* 悬停时的动画效果 */
  &:hover {
    .site-logo {
      transform: translateY(-80px) scale(0.8);
    }
    .flag-background {
      transform: scale(2.5); /* 放大旗帜 */
      opacity: 1;
      animation: flag-wave 5s linear infinite; /* 触发飘扬动画 */
    }
    .personal-info {
      bottom: 20px;
      opacity: 1;
    }
  }
}

/* 旗帜飘扬动画 */
@keyframes flag-wave {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>