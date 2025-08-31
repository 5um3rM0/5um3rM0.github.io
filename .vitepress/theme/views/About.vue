<template>
  <div class="about">
    <h1 class="title">关于站长</h1>

    <!-- 第一行布局 -->
    <div class="about-content" style="grid-template-columns: 3fr 2fr">
      <!-- 介绍卡片 -->
      <div class="about-item hello" ref="helloCard">
        <span class="text1" ref="helloText1">Hi👋</span>
        <span class="text2 title2" ref="helloText2">这里5um3rM0</span>
        <span class="text3" ref="helloText3">是什么人呢？我也不知道啦</span>
      </div>
      <!-- 追求卡片 -->
      <div class="about-item pursuit">
        <span class="tip">追求</span>
        <span class="title2" ref="pursuitText1"></span>
        <span class="title2" ref="pursuitText2"></span>
        <span class="title2" ref="pursuitText3"></span>
      </div>
    </div>

    <!-- 第二行布局 -->
    <div class="about-content" style="grid-template-columns: 2fr 3fr">
      <!-- 技能卡片 -->
      <div class="about-item skills">
        <span class="tip">技能</span>
        <span class="title2">哇 我到底会什么？</span>
        <div class="skills-list">
          <a v-for="(item, index) in skillsData" :key="index" :style="{ '--color': item.color }" :href="item.link"
            class="skills-item" target="_blank">
            <div class="skills-logo"><i :class="`iconfont icon-${item.icon}`"></i></div>
            <span class="skills-name">{{ item.name }}</span>
          </a>
        </div>
      </div>
      <!-- 数字生活卡片 -->
      <div class="about-content" style="display: flex">
        <div class="about-item">
          <span class="tip">数字生活</span>
          <span class="title2">最近在看/听/玩什么</span>
          <div class="media-list">
            <a v-for="item in mediaData" :key="item.name" class="media-item" :href="item.url" target="_blank">
              <img :src="item.cover" :alt="item.name" class="media-cover">
              <div class="media-info">
                <span class="media-title">{{ item.name }}</span>
                <span class="media-artist">{{ item.artist }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- 博主自拍卡片 -->
      <div class="about-item selfie-card">
        <div class="image-container">
          <!-- 动态绑定的主图片 -->
          <img :src="currentSelfie.url" :key="currentSelfie.url" alt="博主自拍" class="selfie-img">
        </div>
        <div class="selfie-overlay">
          <span class="selfie-title">{{ currentSelfie.title }}</span>
          <span class="selfie-subtitle">{{ currentSelfie.subtitle }}</span>
        </div>
        <!-- 故障特效层，背景图同样动态绑定 -->
        <div class="glitch-layers" :style="{ '--glitch-bg': `url(${currentSelfie.url})` }">
          <div class="glitch-layer"></div>
          <div class="glitch-layer"></div>
          <div class="glitch-layer"></div>
        </div>
      </div>
    </div>

    <!-- 心路历程卡片 -->
    <div class="about-content" style="display: flex">
      <div class="about-item">
        <span class="tip">心路历程</span>
        <span class="title2">为什么建站？</span>
        <p class="text">因为想要找个地方记录一下东西，嗯，如果有个网站来写博客的话就更酷了......很无语的理由，对吧？</p>
        <p class="text">这里内容很杂，<strong>生活、随笔、资源分享</strong>......随便写写总之。可能不太会有很多人看（真的有人看么），权当日记。</p>
        <p class="text">这些就是创造这个博客的本意。有幸相遇，玩的开心。</p>
      </div>
    </div>

    <!-- 博客时间轴卡片 -->
    <div class="about-content" style="display: flex">
      <div class="about-item">
        <span class="tip">站点历程</span>
        <span class="title2">一些重要时刻</span>
        <div class="timeline">
          <div class="timeline-item" v-for="item in timelineData" :key="item.date">
            <div class="timeline-date">{{ item.date }}</div>
            <div class="timeline-content">{{ item.event }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';

// 定义技能图标数据
const skillsData = [
  { name: "Python", color: "#3776AB", icon: "python", link: "https://www.python.org/" },
  { name: "Git", color: "#F05032", icon: "git", link: "https://git-scm.com/" },
  { name: "Photoshop", color: "#31A8FF", icon: "photoshop", link: "https://www.adobe.com/cn/lead/creativecloud/business.html" },
  { name: "ChatGPT", color: "#4AA181", icon: "chatgpt", link: "https://chat.openai.com/" },
];

// 定义数字生活卡片的数据
const mediaData = [
  { name: 'American Idiot', artist: 'Green Day', cover: 'http://p1.music.126.net/gn85AxXTWVLbOVmdAJsxrg==/109951163834085468.jpg', url: 'https://music.163.com/#/album?id=73668475' },
  { name: 'Fight Club', artist: 'Movie', cover: 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@.jpg', url: 'https://www.imdb.com/title/tt0137523/' },
  { name: 'Uma Musume:Pretty Derby', artist: 'Game', cover: 'https://static.komoejoy.com/uma/gw/new/_nuxt/images/logo_umamusume-BHRmH5Nz.png', url: 'https://umamusume.jp/' },
  { name: '私が主役じゃダメですか？', artist: 'ダンツフレーム', cover: 'http://p1.music.126.net/jLzwIn67sw4fGOn2a_olPQ==/109951170973803859.jpg', url: 'https://www.bilibili.com/video/BV1Kx4y187Nj/' },
];

// 定义博客时间轴数据
const timelineData = [
  { date: '2025-08-28', event: '在一时冲动下，博客的第一个版本诞生了！' },
  { date: '2025-08-29凌晨，于部署前', event: '超级大改！感谢Google Gemini对本博客的支持（雾）' },
  { date: '2025-08-29上午，在通宵修bug后', event: '谁给的你自信啊？修的我想死，最后还是轻量化掉了一大堆你花了数个小时睡眠时间写的功能......' },
  { date: '未来', event: '更多好玩的功能正在构思中...' },
];

// 定义自拍卡片的数据数组
const selfies = [
  { url: '/images/about/i_drive.png', title: 'I Drive', subtitle: '' },
  { url: '/images/about/i_kill.png', title: 'I Kill', subtitle: '' },
  { url: '/images/about/i_see.png', title: 'I See', subtitle: '' },
  { url: '/images/about/i_shot.png', title: 'I Shot', subtitle: '' },
  { url: '/images/about/i_smile.png', title: 'I Smile', subtitle: '' },
  { url: '/images/about/i_stand.png', title: 'I Stand', subtitle: '' },
];

// 用于自拍卡片图片切换的状态
const currentSelfieIndex = ref(0);
const selfieInterval = ref(null);
const currentSelfie = computed(() => selfies[currentSelfieIndex.value]);

// 用于鼠标视差效果的 DOM 引用
const helloCard = ref(null);
const helloText1 = ref(null);
const helloText2 = ref(null);
const helloText3 = ref(null);

// 用于打字机效果的 DOM 引用
const pursuitText1 = ref(null);
const pursuitText2 = ref(null);
const pursuitText3 = ref(null);

// 鼠标视差效果的事件处理函数
const handleMouseMove = (e) => {
  const card = helloCard.value;
  if (!card || !helloText1.value || !helloText2.value || !helloText3.value) return;
  const { clientX, clientY } = e;
  const { left, top, width, height } = card.getBoundingClientRect();
  const x = (clientX - left - width / 2) / (width / 2);
  const y = (clientY - top - height / 2) / (height / 2);
  helloText1.value.style.transform = `translateX(${-x * 20}px) translateY(${-y * 20}px)`;
  helloText2.value.style.transform = `translateX(${-x * 10}px) translateY(${-y * 10}px)`;
  helloText3.value.style.transform = `translateX(${-x * 5}px) translateY(${-y * 5}px)`;
};
const handleMouseLeave = () => {
  if (!helloText1.value || !helloText2.value || !helloText3.value) return;
  helloText1.value.style.transform = `translate(0, 0)`;
  helloText2.value.style.transform = `translate(0, 0)`;
  helloText3.value.style.transform = `translate(0, 0)`;
};

// 打字机效果的实现函数
const typeWriter = (element, text, speed = 150) => {
  if (!element) return;
  let i = 0;
  const typing = () => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else {
      element.style.borderRight = 'none';
    }
  };
  typing();
};

// 组件挂载后的生命周期钩子
onMounted(() => {
  // 绑定鼠标视差事件
  if (helloCard.value) {
    helloCard.value.addEventListener('mousemove', handleMouseMove);
    helloCard.value.addEventListener('mouseleave', handleMouseLeave);
  }

  // 启动打字机效果
  typeWriter(pursuitText1.value, '好玩的事');
  setTimeout(() => typeWriter(pursuitText2.value, '如果喜欢的话 偶尔也好'), 1200);
  setTimeout(() => typeWriter(pursuitText3.value, '记住我吧'), 3200);

  // 启动自拍卡片图片轮播
  selfieInterval.value = setInterval(() => {
    currentSelfieIndex.value = (currentSelfieIndex.value + 1) % selfies.length;
  }, 4000); // 每4秒切换一次
});

// 组件卸载前的生命周期钩子
onBeforeUnmount(() => {
  // 移除事件监听以防止内存泄漏
  if (helloCard.value) {
    helloCard.value.removeEventListener('mousemove', handleMouseMove);
    helloCard.value.removeEventListener('mouseleave', handleMouseLeave);
  }
  // 清除定时器
  if (selfieInterval.value) {
    clearInterval(selfieInterval.value);
  }
});
</script>

<style lang="scss" scoped>
/* 页面基础样式 */
.about {
  .title {
    font-size: 2.4rem;
    text-align: center;
    border: none;
  }

  .about-content {
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px;
    margin-bottom: 20px;
  }

  .about-item {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1.2rem 2rem;
    border-radius: 12px;
    background-color: var(--main-card-background);
    border: 1px solid var(--main-card-border);
    box-shadow: 0 8px 12px -4px var(--main-border-shadow);
    overflow: hidden;
  }

  .tip {
    font-size: 14px;
    opacity: 0.8;
    margin-bottom: 12px;
  }

  .title2 {
    font-size: 36px;
    font-weight: bold;
    margin-right: 4rem;
  }

  .text {
    font-size: 18px;
    margin: 0.6rem 0;
  }

  .about-content:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    .about-content {
      display: flex;
      flex-direction: column;
    }
  }
}

/* “Hello”卡片样式 */
.hello {
  justify-content: center;
  padding: 2rem;
  color: #fff;
  background-image: linear-gradient(120deg, #5b27ff 0%, #00d4ff 100%);
  background-size: 200% 200%;
  animation: gradientFlow 6s ease infinite;

  .title2 {
    line-height: 2;
  }

  .text1,
  .text2,
  .text3 {
    transition: transform 0.1s ease-out;
  }
}

/* “追求”卡片样式 */
.pursuit {
  .title2 {
    line-height: 1.2;
    border-right: 4px solid transparent;
    animation: blink 1s step-end infinite;

    &:last-child {
      display: inline-block;
      background-size: 100% 100%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-repeat: no-repeat;
      background-image: linear-gradient(45deg, #fa7671 50%, #f45f7f);
    }
  }
}

/* “技能”卡片样式 */
.skills-list {
  margin-top: 12px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.skills-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-top: 10px;
  padding: 8px 12px 8px 8px;
  border-radius: 40px;
  background-color: var(--main-site-background);
  border: 1px solid var(--main-card-border);
  box-shadow: 0 8px 12px -4px var(--main-border-shadow);
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: var(--main-card-background);

    .skills-logo {
      animation: breath 1.5s ease-in-out infinite;
    }
  }
}

.skills-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  border-radius: 50%;
  background-color: var(--color);

  .iconfont {
    color: #fff;
  }
}

.skills-name {
  font-weight: bold;
  transition: color 0.3s;
}

/* “自拍”卡片样式 */
.selfie-card {
  padding: 0 !important;
  background: #000;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before,
  &::after {
    content: '';
    position: absolute;
  }

  &::before {
    /* 流光边框 */
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(transparent, rgba(0, 255, 255, 0.8), rgba(255, 0, 255, 0.8), transparent 30%);
    transform: translate(-50%, -50%);
    animation: rotate-border 4s linear infinite;
    opacity: 0;
    transition: opacity 0.5s;
  }

  &::after {
    /* 内层遮罩 */
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: #111;
    border-radius: 12px;
  }

  &:hover::before {
    opacity: 1;
  }
}

.image-container {
  /* 用于图片切换动画 */
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.selfie-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.5s ease, filter 0.5s ease;
  animation: fadeIn 0.8s ease;

  &:hover {
    transform: scale(1.2);
    filter: brightness(0.5) saturate(1.5);
  }
}

.selfie-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  z-index: 4;
  transition: transform 0.4s ease;

  .selfie-title,
  .selfie-subtitle {
    transition: all 0.4s ease;
  }

  &:hover {
    transform: translateY(-10px);

    .selfie-title {
      animation: text-flicker 3s linear infinite;
    }

    .selfie-subtitle {
      animation: text-flicker 5s linear infinite;
    }
  }
}

.glitch-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  overflow: hidden;
  border-radius: 12px;
}

.glitch-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(--glitch-bg);
  background-size: cover;
  background-position: center;
  opacity: 0;

  &::after {
    /* 扫描线 */
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 200%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%);
    background-size: 100% 4px;
    animation: scanline 3s linear infinite;
  }
}

.selfie-card:hover {
  .selfie-img {
    transform: scale(1.2);
    filter: brightness(0.5) saturate(1.5);
  }

  .selfie-overlay {
    transform: translateY(-10px);
  }

  .selfie-overlay .selfie-title {
    animation: text-flicker 3s linear infinite;
  }

  .selfie-overlay .selfie-subtitle {
    animation: text-flicker 5s linear infinite;
  }

  .glitch-layers .glitch-layer:nth-child(1) {
    animation: glitch-v2 1s steps(4, end) infinite;
  }

  .glitch-layers .glitch-layer:nth-child(2) {
    animation: glitch-v2 1.5s steps(2, end) infinite reverse;
  }

  .glitch-layers .glitch-layer:nth-child(3) {
    animation: glitch-v2 1.2s steps(5, end) infinite;
  }
}

/* “数字生活”卡片样式 */
.media-list {
  display: flex;
  overflow-x: auto;
  gap: 1.5rem;
  padding: 1rem 0;
  margin-top: 1rem;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--main-card-border);
    border-radius: 3px;
  }
}

.media-item {
  flex-shrink: 0;
  width: 150px;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.media-cover {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.media-title {
  display: block;
  font-weight: bold;
  font-size: 1rem;
  color: var(--main-font-color);
}

.media-artist {
  display: block;
  font-size: 0.9rem;
  color: var(--main-font-second-color);
}

/* “博客时间轴”卡片样式 */
.timeline {
  margin-top: 1.5rem;
  position: relative;
  padding-left: 2rem;

  &::before {
    /* 竖线 */
    content: '';
    position: absolute;
    left: 10px;
    top: 5px;
    bottom: 5px;
    width: 2px;
    background-color: var(--main-card-border);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    /* 圆点 */
    content: '';
    position: absolute;
    left: -2rem;
    top: 5px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--main-card-background);
    border: 2px solid var(--main-color);
  }
}

.timeline-date {
  font-weight: bold;
  color: var(--main-color);
  margin-bottom: 0.3rem;
}

.timeline-content {
  color: var(--main-font-second-color);
}

/* 动画关键帧 */
@keyframes gradientFlow {
  0% {
    background-position: 0% 50%
  }

  50% {
    background-position: 100% 50%
  }

  100% {
    background-position: 0% 50%
  }
}

@keyframes blink {

  from,
  to {
    border-color: transparent;
  }

  50% {
    border-color: var(--main-font-color);
  }
}

@keyframes breath {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes rotate-border {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes scanline {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes text-flicker {

  0%,
  18%,
  22%,
  25%,
  53%,
  57%,
  100% {
    text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #0fa, 0 0 80px #0fa, 0 0 90px #0fa, 0 0 100px #0fa, 0 0 150px #0fa;
  }

  20%,
  24%,
  55% {
    text-shadow: none;
  }
}

@keyframes glitch-v2 {
  0% {
    clip-path: inset(89% 0 1% 0);
    transform: translate(-10px, 0);
    opacity: 0.8;
  }

  10% {
    clip-path: inset(54% 0 1% 0);
    transform: translate(10px, 5px);
  }

  20% {
    clip-path: inset(93% 0 3% 0);
    transform: translate(5px, -5px);
    mix-blend-mode: color-dodge;
    filter: hue-rotate(90deg);
  }

  30% {
    clip-path: inset(1% 0 80% 0);
    transform: translate(-2px, 2px);
  }

  40% {
    clip-path: inset(20% 0 20% 0);
    transform: translate(0, 0);
    mix-blend-mode: screen;
  }

  50% {
    clip-path: inset(83% 0 10% 0);
    transform: translate(10px, -5px);
  }

  60% {
    clip-path: inset(40% 0 40% 0);
    transform: translate(0, 0);
    filter: hue-rotate(270deg);
  }

  70% {
    clip-path: inset(95% 0 1% 0);
    transform: translate(-10px, 5px);
    mix-blend-mode: exclusion;
  }

  80% {
    clip-path: inset(5% 0 90% 0);
    transform: translate(5px, 0);
  }

  90% {
    clip-path: inset(60% 0 30% 0);
    transform: translate(-5px, -5px);
  }

  100% {
    clip-path: inset(89% 0 1% 0);
    transform: translate(0);
    opacity: 0.8;
  }
}
</style>