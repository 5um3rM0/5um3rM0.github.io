<template>
  <div class="not-found">
    <!-- 粒子背景 -->
    <div class="particle-bg">
      <div v-for="i in 50" :key="i" class="particle"></div>
    </div>
    
    <div class="not-found-content">
      <h1 class="title">404</h1>
      <p class="title-tip">你似乎闯入了一片未知的星域</p>
      <p class="subtitle">别担心，迷路也是探索的一部分。让我们回到熟悉的航道吧。</p>
      <button class="to-home" @click="router.go('/')">
        <i class="iconfont icon-rocket"></i>
        <span>返回基地</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

// 鼠标互动逻辑
onMounted(() => {
  const container = document.querySelector('.not-found');
  if (!container) return;
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1
    
    container.style.setProperty('--mouse-x', x);
    container.style.setProperty('--mouse-y', y);
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove);
  });
});
</script>

<style lang="scss" scoped>
@use "sass:math";

.not-found {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  overflow: hidden;
  --mouse-x: 0;
  --mouse-y: 0;
}

.particle-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  .particle {
    position: absolute;
    background: var(--main-font-second-color);
    border-radius: 50%;
    opacity: 0.5;
    // 基础动画
    animation: float 20s infinite linear;
    // 鼠标互动
    transform: translate(calc(var(--mouse-x) * -20px), calc(var(--mouse-y) * -20px));
    transition: transform 0.3s ease-out;

    @for $i from 1 through 50 {
      &:nth-child(#{$i}) {
        $size: math.random(3) + 1px;
        top: #{math.random(100)}vh;
        left: #{math.random(100)}vw;
        width: $size;
        height: $size;
        animation-duration: #{math.random(20) + 20}s;
        animation-delay: -#{math.random(40)}s;
        // 让不同粒子对鼠标的反应强度不同
        transform: translate(calc(var(--mouse-x) * -#{math.random(30) + 10}px), calc(var(--mouse-y) * -#{math.random(30) + 10}px));
      }
    }
  }
}

.not-found-content {
  position: relative;
  z-index: 2;
  text-align: center;
  animation: fade-up 0.8s backwards;
  
  .title {
    font-size: 8rem;
    margin: 0;
    line-height: 1;
    color: var(--main-font-color);
    text-shadow: 0 5px 15px var(--main-border-shadow);
  }
  
  .title-tip {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--main-font-color);
    margin-top: 1rem;
    display: block;
  }

  .subtitle {
    font-size: 1rem;
    color: var(--main-font-second-color);
    margin: 0.5rem 0 2.5rem 0;
  }
  
  .to-home {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    padding: 12px 26px;
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--main-card-background);
    background-color: var(--main-color);
    border-radius: 12px;
    border: none;
    transition: all 0.3s;
    cursor: pointer;
    box-shadow: 0 4px 15px -5px var(--main-color);
    
    .iconfont { font-size: 1.5rem; }
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px -8px var(--main-color);
    }
  }
}

@keyframes float {
  0% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(10px); }
  100% { transform: translateY(0) translateX(0); }
}
</style>