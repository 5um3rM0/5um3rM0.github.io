<template>
  <div v-if="show" class="birthday-wrapper" @click="handleClose">
    <!-- 背景效果层 -->
    <div class="background-effects">
      <div class="stars"></div>
    </div>
    
    <!-- 主要动画粒子 -->
    <div class="effect-container">
      <!-- 气球 -->
      <div v-for="i in 30" :key="'balloon-' + i" class="particle balloon" 
           :style="{
             left: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 5}s`,
             animationDuration: `${8 + Math.random() * 10}s`,
             '--balloon-color': balloonColors[i % balloonColors.length]
           }">
        <div class="balloon-knot"></div>
      </div>
      
      <!-- 星星 -->
      <div v-for="i in 50" :key="'star-' + i" class="particle star"
           :style="{
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 3}s`,
             animationDuration: `${2 + Math.random() * 3}s`,
             transform: `scale(${0.5 + Math.random() * 1.5}) rotate(${Math.random() * 360}deg)`
           }"></div>
      
      <!-- 彩带 -->
      <div v-for="i in 20" :key="'ribbon-' + i" class="particle ribbon"
           :style="{
             left: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 4}s`,
             animationDuration: `${6 + Math.random() * 6}s`,
             '--ribbon-color': ribbonColors[i % ribbonColors.length]
           }"></div>
    </div>
    
    <!-- 烟花效果容器 -->
    <div class="fireworks-container" ref="fireworksContainer"></div>
    
    <!-- 主消息卡片 -->
    <div class="message-box">
      <div class="confetti-container"></div>
      <div class="message-content">
        <div class="decor top-left"></div>
        <div class="decor top-right"></div>
        <div class="decor bottom-left"></div>
        <div class="decor bottom-right"></div>
        
        <span class="happy-text">Happy Birthday!</span>
        <span class="name">小露</span>
        <span class="wish-text">生日快乐！！！又过一年！！！🎂</span>
        <div class="close-hint">（点击任意位置关闭）</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const show = ref(true);
const fireworksContainer = ref(null);
let animationFrameId = null;
let fireworks = [];
let lastFireworkTime = 0;

// 颜色数组 - 用于气球和彩带的多彩效果
const balloonColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#D7BDE2', '#58D68D', '#F5B041', '#BB8FCE'
];

const ribbonColors = [
  '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
  '#1ABC9C', '#E67E22', '#34495E', '#95A5A6', '#27AE60'
];

// 创建烟花效果
const createFirework = () => {
  if (!fireworksContainer.value) return;
  
  const firework = document.createElement('div');
  firework.className = 'firework';
  
  // 随机位置和颜色
  const startX = Math.random() * 100;
  const startY = 100;
  const endX = 30 + Math.random() * 40;
  const endY = 20 + Math.random() * 30;
  const hue = 10 + Math.random() * 340;
  
  firework.style.left = `${startX}%`;
  firework.style.bottom = `${startY}%`;
  firework.style.setProperty('--hue', hue);
  
  fireworksContainer.value.appendChild(firework);
  
  // 发射动画
  setTimeout(() => {
    firework.style.transform = `translate(${endX - startX}vw, -${startY - endY}vh)`;
    
    // 爆炸效果
    setTimeout(() => {
      firework.classList.add('exploded');
      
      // 创建爆炸粒子
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.setProperty('--hue', hue);
        particle.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
        firework.appendChild(particle);
      }
      
      // 清理
      setTimeout(() => {
        if (firework.parentNode === fireworksContainer.value) {
          fireworksContainer.value.removeChild(firework);
        }
      }, 1500);
    }, 1000);
  }, 10);
  
  fireworks.push(firework);
};

// 动画循环 - 控制烟花发射频率
const animate = (timestamp) => {
  if (!show.value) return;
  
  // 随机创建烟花
  if (timestamp - lastFireworkTime > 2000 + Math.random() * 3000) {
    createFirework();
    lastFireworkTime = timestamp;
  }
  
  animationFrameId = requestAnimationFrame(animate);
};

// 关闭处理
const handleClose = () => {
  show.value = false;
};

// 生命周期钩子
onMounted(() => {
  // 创建背景星星
  const starsContainer = document.querySelector('.stars');
  for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.className = 'star-bg';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.width = `${Math.random() * 3 + 1}px`;
    star.style.height = star.style.width;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.opacity = Math.random() * 0.8 + 0.2;
    starsContainer.appendChild(star);
  }
  
  // 创建彩屑
  const confettiContainers = document.querySelectorAll('.confetti-container');
  confettiContainers.forEach(container => {
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${Math.random() * 100}%`;
      confetti.style.width = `${Math.random() * 6 + 3}px`;
      confetti.style.height = `${Math.random() * 3 + 2}px`;
      confetti.style.backgroundColor = ribbonColors[Math.floor(Math.random() * ribbonColors.length)];
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.animationDelay = `${Math.random() * 10}s`;
      confetti.style.animationDuration = `${5 + Math.random() * 5}s`;
      container.appendChild(confetti);
    }
  });
  
  animationFrameId = requestAnimationFrame(animate);
});

// 清理资源
onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  // 清理烟花元素
  if (fireworksContainer.value) {
    while (fireworksContainer.value.firstChild) {
      fireworksContainer.value.removeChild(fireworksContainer.value.firstChild);
    }
  }
});
</script>

<style lang="scss" scoped>
@use "sass:math";

// 全局变量
$card-padding: 2.5rem;
$card-radius: 20px;

.birthday-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: all;
  z-index: 9999;
  overflow: hidden;
  cursor: pointer;
  background: radial-gradient(circle at center, #1a1a2e 0%, #16213e 100%);
  animation: fadeIn 1s ease-out;
}

// 背景星星效果
.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.stars {
  width: 100%;
  height: 100%;
}

.star-bg {
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.8);
  animation: twinkle 4s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

// 消息卡片
.message-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: $card-padding;
  border-radius: $card-radius;
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.9), rgba(255, 215, 0, 0.9));
  backdrop-filter: blur(15px);
  box-shadow: 0 0 60px rgba(255, 105, 180, 0.8), 
              0 0 100px rgba(255, 215, 0, 0.5),
              inset 0 0 20px rgba(255, 255, 255, 0.3);
  animation: pulse 3s infinite, popIn 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  border: 2px solid rgba(255, 255, 255, 0.2);
  min-width: 300px;
  max-width: 90%;
  
  // 装饰角落
  .decor {
    position: absolute;
    width: 30px;
    height: 30px;
    opacity: 0.7;
  }
  
  .top-left { top: 10px; left: 10px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z' /%3E%3C/svg%3E"); }
  .top-right { top: 10px; right: 10px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z' /%3E%3C/svg%3E"); }
  .bottom-left { bottom: 10px; left: 10px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z' /%3E%3C/svg%3E"); }
  .bottom-right { bottom: 10px; right: 10px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z' /%3E%3C/svg%3E"); }
  
  .message-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    position: relative;
  }
  
  .happy-text { 
    font-size: 2.5rem; 
    font-weight: bold; 
    position: relative;
    padding: 0 1rem;
    
    &::before, &::after {
      content: "🎉";
      margin: 0 10px;
    }
  }
  
  .name { 
    font-size: 4rem; 
    font-weight: 900; 
    margin: 10px 0;
    background: linear-gradient(90deg, #fff, #f9f, #ff9);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: nameShine 3s infinite;
  }
  
  .wish-text { 
    font-size: 1.5rem; 
    margin-top: 0.5rem; 
    font-style: italic;
  }
  
  .close-hint { 
    font-size: 0.9rem; 
    margin-top: 1.5rem; 
    opacity: 0.8; 
  }
}

// 彩屑容器
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  opacity: 0;
  animation: confettiFall 8s infinite linear;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(150px) rotate(360deg);
    opacity: 0;
  }
}

// 粒子效果容器
.effect-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  opacity: 0;
}

// 气球样式
.balloon {
  width: 30px;
  height: 40px;
  background-color: var(--balloon-color);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  bottom: -50px;
  animation: balloonRise 15s infinite ease-in;
  box-shadow: inset -10px -10px 0 rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 20px;
    background-color: rgba(255, 255, 255, 0.5);
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.balloon-knot {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes balloonRise {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-110vh) rotate(30deg); opacity: 0; }
}

// 星星样式
.star {
  width: 15px;
  height: 15px;
  background-color: #ffd700;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: starTwinkle 3s infinite ease-in-out;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
}

@keyframes starTwinkle {
  0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.6; }
  50% { transform: scale(1.2) rotate(10deg); opacity: 1; }
}

// 彩带样式
.ribbon {
  width: 10px;
  height: 80px;
  background-color: var(--ribbon-color);
  top: -100px;
  transform-origin: top center;
  animation: ribbonFall 10s infinite ease-in;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 25px;
    bottom: -10px;
  }
  
  &::before {
    background-color: var(--ribbon-color);
    transform: rotate(45deg);
    left: -8px;
  }
  
  &::after {
    background-color: var(--ribbon-color);
    transform: rotate(-45deg);
    right: -8px;
  }
}

@keyframes ribbonFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

// 烟花效果
.fireworks-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.firework {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: hsl(var(--hue), 80%, 60%);
  border-radius: 50%;
  transform: translate(0, 0);
  transition: transform 1s cubic-bezier(0.25, 0.1, 0.25, 1);
  z-index: 10;
}

.firework.exploded {
  background-color: transparent;
  width: 10px;
  height: 10px;
}

.firework-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: hsl(var(--hue), 80%, 70%);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(0, 0);
  opacity: 0;
  animation: fireworkParticle 1.5s ease-out forwards;
  box-shadow: 0 0 6px 1px hsl(var(--hue), 80%, 70%);
}

@keyframes fireworkParticle {
  0% { transform: translate(0, 0); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
}

// 动画效果
@keyframes pulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1); 
    box-shadow: 0 0 60px rgba(255, 105, 180, 0.8), 
                0 0 100px rgba(255, 215, 0, 0.5);
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.05); 
    box-shadow: 0 0 80px rgba(255, 105, 180, 0.9), 
                0 0 120px rgba(255, 215, 0, 0.7);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
  70% { transform: translate(-50%, -50%) scale(1.1); }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

@keyframes nameShine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

// 响应式调整
@media (max-width: 768px) {
  $card-padding: 1.5rem;
  
  .message-box {
    .happy-text { font-size: 2rem; }
    .name { font-size: 3rem; }
    .wish-text { font-size: 1.2rem; }
  }
}
</style>
