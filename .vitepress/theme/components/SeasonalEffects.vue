<template>
  <div :class="['seasonal-container', season]">
    <div v-for="i in 50" :key="i" class="particle"></div>
  </div>
</template>

<script setup>
defineProps({
  season: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
/* 基础容器样式 */
.seasonal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
  

  /* 基础粒子样式 */
  .particle {
    position: absolute;
    opacity: 0; // 默认隐藏
  }
  
  /* SCSS 工具函数 */
  @function random_range($min, $max) {
    $rand: random();
    $random_range: $min + floor($rand * (($max - $min) + 1));
    @return $random_range;
  }
  
  /* 春季：花瓣 */
  &.spring {
    .particle {
      top: -20px;
      width: 10px;
      height: 10px;
      background-color: #ffc0cb;
      border-radius: 1px 50%;
      opacity: 0.8;
      animation: drift linear infinite;
      left: #{random(100)}vw;

      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          animation-duration: #{random_range(15, 30)}s;
          animation-delay: -#{random(30)}s;
        }
      }
    }
  }
  
  /* 夏季：暖阳微尘 */
  &.summer {
    .particle {
      bottom: -20px;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(255, 223, 100, 0.6) 0%, rgba(255, 223, 100, 0) 70%);
      border-radius: 50%;
      opacity: 0;
      animation: rise linear infinite;
      left: #{random(100)}vw;

      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          $size: #{random(40) + 10}px;
          width: $size;
          height: $size;
          animation-duration: #{random_range(20, 40)}s;
          animation-delay: -#{random(40)}s;
        }
      }
    }
  }
  
  /* 秋季：落叶 */
  &.autumn {
    .particle {
      top: -20px;
      width: 15px;
      height: 15px;
      background-color: #d95b00;
      border-radius: 1px 50%;
      opacity: 0.9;
      animation: flutter linear infinite;
      left: #{random(100)}vw;
      &:nth-child(2n) { background-color: #a63c00; }

      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          animation-duration: #{random_range(10, 25)}s;
          animation-delay: -#{random(25)}s;
        }
      }
    }
  }
  
  /* 冬季：雪花 */
  &.winter {
    .particle {
      top: -10px;
      width: 5px;
      height: 5px;
      background-color: white;
      border-radius: 50%;
      opacity: 0.7;
      animation: fall linear infinite;
      left: #{random(100)}vw;

      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          $size: #{random(5) + 2}px;
          width: $size;
          height: $size;
          animation-duration: #{random_range(10, 30)}s;
          animation-delay: -#{random(30)}s;
        }
      }
    }
  }
}

/* 动画关键帧 */
@keyframes drift { to { transform: translateY(105vh) rotate(720deg); } }
@keyframes rise { 0% { transform: translateY(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-105vh); opacity: 0; } }
@keyframes flutter { to { transform: translateY(105vh) rotate(600deg); } }
@keyframes fall { to { transform: translateY(105vh); } }
</style>