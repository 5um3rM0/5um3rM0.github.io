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
@use "sass:math";

.seasonal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
  
  .particle {
    position: absolute;
    opacity: 0;
  }
  
  @function random_range($min, $max) {
    $rand: math.random();
    $random_range: $min + math.floor($rand * (($max - $min) + 1));
    @return $random_range;
  }
  
  &.spring {
    .particle {
      left: #{math.random(100)}vw;
      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          animation-duration: #{random_range(15, 30)}s;
          animation-delay: -#{random_range(30)}s;
        }
      }
    }
  }
  
  &.summer {
    .particle {
      /* ... */
      left: #{math.random(100)}vw;
      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          $size: #{math.random(40) + 10}px;
          width: $size;
          height: $size;
          animation-duration: #{random_range(20, 40)}s;
          animation-delay: -#{random_range(40)}s;
        }
      }
    }
  }
  
  &.autumn {
    .particle {
      /* ... */
      left: #{math.random(100)}vw;
      /* ... */
      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          animation-duration: #{random_range(10, 25)}s;
          animation-delay: -#{random_range(25)}s;
        }
      }
    }
  }
  
  &.winter {
    .particle {
      /* ... */
      left: #{math.random(100)}vw;
      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          $size: #{math.random(5) + 2}px;
          width: $size;
          height: $size;
          animation-duration: #{random_range(10, 30)}s;
          animation-delay: -#{random_range(30)}s;
        }
      }
    }
  }
}

/* 动画关键帧保持不变 */
@keyframes drift { to { transform: translateY(105vh) rotate(720deg); } }
@keyframes rise { 0% { transform: translateY(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-105vh); opacity: 0; } }
@keyframes flutter { to { transform: translateY(105vh) rotate(600deg); } }
@keyframes fall { to { transform: translateY(105vh); } }
</style>