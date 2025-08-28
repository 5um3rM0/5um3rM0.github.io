<template>
  <div v-if="show" class="birthday-wrapper" @click="close">
    <!-- 特效容器 -->
    <div class="effect-container">
      <div v-for="i in 100" :key="i" class="particle"></div>
    </div>
    
    <!-- 祝福语容器 -->
    <div class="message-box">
      <div class="message-content">
        <span class="happy-text">Happy Birthday!</span>
        <span class="name">小露</span>
        <span class="wish-text">生日快乐啊！又过了一年！🎂</span>
        <div class="close-hint">（点击任意位置关闭）</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const show = ref(false);

// 控制入场动画和自动关闭
onMounted(() => {
  show.value = true;
});

const close = () => {
  show.value = false;
};
</script>

<style lang="scss" scoped>
.birthday-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: all; // 允许点击关闭
  z-index: 9999; // 最高层级
  overflow: hidden;
  cursor: pointer;
  animation: fadeIn 1s ease-out;
}

// 祝福语样式
.message-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2rem 3rem;
  border-radius: 15px;
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
  background: linear-gradient(45deg, rgba(255, 215, 0, 0.7), rgba(255, 105, 180, 0.7));
  backdrop-filter: blur(12px);
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
  animation: pulse 2.5s infinite, popIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);

  .message-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .happy-text { font-size: 2rem; font-weight: bold; }
  .name { font-size: 3.5rem; font-weight: 900; }
  .wish-text { font-size: 1.2rem; margin-top: 0.5rem; }
  .close-hint { font-size: 0.8rem; margin-top: 1.5rem; opacity: 0.7; }
}

// 华丽特效 (五彩纸屑 + 上升光点)
.effect-container {
  width: 100%;
  height: 100%;
}
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  &:nth-child(2n) { // 五彩纸屑
    top: -20px;
    width: 8px;
    height: 15px;
    border-radius: 0;
    background-color: hsl(random(360), 90%, 70%);
    animation: fall 8s infinite ease-out;
  }
  &:nth-child(2n + 1) { // 上升光点
    bottom: -20px;
    background-color: gold;
    box-shadow: 0 0 10px gold;
    animation: rise 8s infinite ease-in;
  }
  @for $i from 1 through 100 {
    &:nth-child(#{$i}) {
      $size: random(10) + 5px;
      width: $size; height: $size;
      left: #{random(100)}vw;
      animation-duration: #{random(8) + 5}s;
      animation-delay: #{random(8)}s;
    }
  }
}

// 动画
@keyframes rise { to { transform: translateY(-105vh); opacity: 1; } }
@keyframes fall { to { transform: translateY(105vh) rotate(360deg); opacity: 1; } }
@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
  50% { transform: translate(-50%, -50%) scale(1.05); box-shadow: 0 0 60px rgba(255, 105, 180, 0.9); }
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes popIn {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}
</style>