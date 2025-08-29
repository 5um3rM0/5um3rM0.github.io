<template>
  <div :class="['seasonal-container', season, { 'interactive': interactive }]" :style="[
    { opacity: isVisible ? 1 : 0 },
    { '--intensity': intensity }
  ]" @mousemove="handleMouseMove">
    <div v-for="i in particleCount" :key="i" class="particle"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  season: {
    type: String,
    required: true,
    validator: (value) => ['spring', 'summer', 'autumn', 'winter'].includes(value)
  },
  particleCount: {
    type: Number,
    default: 50,
    validator: (value) => value >= 10 && value <= 100
  },
  interactive: { type: Boolean, default: true },
  intensity: {
    type: Number,
    default: 1,
    validator: (value) => value >= 0.5 && value <= 2
  }
});

const isVisible = ref(false);
const mousePosition = ref({ x: 0.5, y: 0.5 });

onMounted(() => { isVisible.value = true; });

watch(() => props.season, () => {
  isVisible.value = false;
  setTimeout(() => { isVisible.value = true; }, 500);
});

const handleMouseMove = (e) => {
  if (props.interactive) {
    mousePosition.value = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    };
  }
};
</script>
<style lang="scss" scoped>
@use "sass:math";
@use "sass:color";

$base-opacity: 0.8;

.seasonal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 999;
  overflow: hidden;
  transition: opacity 0.5s ease-in-out;
  --intensity: 1;
  --base-opacity: #{$base-opacity};

  .particle {
    position: absolute;
    transition: transform 0.5s ease-out;
    will-change: transform, opacity;
  }

  @function random-range($min, $max, $index: 1) {
    $seed: $index * 0.123456789 + math.random();
    $fraction: $seed - math.floor($seed);
    @return $min +$fraction * ($max - $min);
  }

  // 春天特效
  &.spring .particle {
    @for $i from 1 through 80 {
      &:nth-child(#{$i}) {
        $type: if(math.random() > 0.7, "bud", "petal");
        left: random-range(5, 95, $i) * 1%;
        top: -15 * 1%;
        opacity: random-range(0.6, $base-opacity, $i);

        @if $type =="petal" {
          width: #{random-range(7, 13, $i)}px;
          height: #{random-range(7, 13, $i)}px;
          background: linear-gradient(45deg,
              if(math.random() > 0.5, #ffccd5, #ffe6ed),
              if(math.random() > 0.5, #e6f7e9, #d1fae5));
          border-radius: 80% 0 80% 0;
          transform: rotate(#{random-range(0, 360, $i)}deg);
          animation: spring-float calc(#{random-range(13, 27, $i)}s / var(--intensity)) linear infinite;
          animation-delay: -#{random-range(0, 27, $i)}s;
        }

        @if $type =="bud" {
          width: #{random-range(4, 7, $i)}px;
          height: #{random-range(9, 16, $i)}px;
          background: linear-gradient(to bottom, #a3e635, #4caf50);
          border-radius: 0 0 6px 6px;
          animation: spring-rise calc(#{random-range(16, 32, $i)}s / var(--intensity)) linear infinite;
          animation-delay: -#{random-range(0, 32, $i)}s;
        }
      }
    }
  }

  // 夏天特效
  &.summer .particle {
    @for $i from 1 through 80 {
      &:nth-child(#{$i}) {
        $type: if(math.random() > 0.8, "bird", if(math.random() > 0.7, "sunray", "glow"));
        left: random-range(5, 95, $i) * 1%;
        opacity: 0;

        @if $type =="glow" {
          bottom: -20 * 1%;
          width: #{random-range(18, 45, $i)}px;
          height: #{random-range(18, 45, $i)}px;
          background: radial-gradient(circle,
              rgba(255, 240, 150, random-range(0.5, $base-opacity, $i)) 0%,
              rgba(255, 223, 100, 0) 75%);
          border-radius: 50%;
          animation: summer-rise calc(#{random-range(22, 43, $i)}s / var(--intensity)) linear infinite,
          summer-pulse calc(#{random-range(3, 6, $i)}s / var(--intensity)) ease-in-out infinite alternate;
          animation-delay: -#{random-range(0, 43, $i)}s;
        }

        @if $type =="sunray" {
          top: random-range(8, 25, $i) * 1%;
          right: -8 * 1%;
          width: #{random-range(110, 220, $i)}px;
          height: 3px;
          background: linear-gradient(to right,
              rgba(255, 223, 100, 0),
              rgba(255, 223, 100, random-range(0.3, 0.6, $i)),
              rgba(255, 223, 100, 0));
          transform-origin: left center;
          transform: rotate(#{random-range(-40, 40, $i)}deg);
          animation: summer-ray calc(#{random-range(32, 65, $i)}s / var(--intensity)) linear infinite;
          animation-delay: -#{random-range(0, 65, $i)}s;
        }

        @if $type =="bird" {
          top: random-range(12, 35, $i) * 1%;
          left: -15 * 1%;
          width: #{random-range(18, 33, $i)}px;
          height: #{random-range(6, 11, $i)}px;
          border-radius: 50% / 30%;
          background-color: rgba(40, 40, 40, random-range(0.4, 0.7, $i));
          animation: summer-fly calc(#{random-range(42, 85, $i)}s / var(--intensity)) linear infinite,
          summer-bob calc(#{random-range(2, 4, $i)}s / var(--intensity)) ease-in-out infinite alternate;
          animation-delay: -#{random-range(0, 85, $i)}s;

          &::before,
          &::after {
            content: '';
            position: absolute;
            background-color: inherit;
            width: 65%;
            height: 100%;
            border-radius: 50%;
          }

          &::before {
            top: -45%;
            left: 0;
            transform: rotate(-35deg);
          }

          &::after {
            top: -45%;
            right: 0;
            transform: rotate(35deg);
          }
        }
      }
    }
  }

  // 秋天特效
  &.autumn .particle {
    @for $i from 1 through 80 {
      &:nth-child(#{$i}) {
        $type: if(math.random() > 0.85, "fruit", "leaf");
        left: random-range(5, 95, $i) * 1%;
        top: -15 * 1%;
        opacity: random-range(0.75, $base-opacity, $i);

        @if $type =="leaf" {
          $leaf-color: if(math.random() > 0.8, #9a3412, if(math.random() > 0.6, #ea580c, if(math.random() > 0.4, #f59e0b, #d97706)));
          width: #{random-range(13, 22, $i)}px;
          height: #{random-range(11, 20, $i)}px;
          background: linear-gradient(45deg, $leaf-color, color.adjust($leaf-color, $lightness: -10%)); // <--- 修正点
          border-radius: 10% 70% 30% 60%;
          transform: rotate(#{random-range(0, 360, $i)}deg);
          animation: autumn-fall calc(#{random-range(11, 27, $i)}s / var(--intensity)) ease-in-out infinite;
          animation-delay: -#{random-range(0, 27, $i)}s;

          &::before {
            content: '';
            position: absolute;
            width: 65%;
            height: 2.5px;
            background-color: rgba(0, 0, 0, 0.3);
            top: 50%;
            left: 20%;
            transform: rotate(#{random-range(-35, 35, $i)}deg);
          }
        }

        @if $type =="fruit" {
          width: #{random-range(7, 13, $i)}px;
          height: #{random-range(7, 13, $i)}px;
          background: linear-gradient(45deg,
              if(math.random() > 0.5, #dc2626, #e11d48),
              if(math.random() > 0.5, #9b2226, #b91c1c));
          border-radius: 50%;

          &::before {
            content: '';
            position: absolute;
            width: 9px;
            height: 2.5px;
            background-color: #6b7280;
            top: -3px;
            left: 30%;
            transform: rotate(45deg);
          }

          animation: autumn-sway calc(#{random-range(8, 18, $i)}s / var(--intensity)) linear infinite;
          animation-delay: -#{random-range(0, 18, $i)}s;
        }
      }
    }
  }

  // 冬天特效
  &.winter .particle {
    @for $i from 1 through 80 {
      &:nth-child(#{$i}) {
        $type: if(math.random() > 0.8, "frost", if(math.random() > 0.7, "flake-cluster", "flake"));
        left: random-range(5, 95, $i) * 1%;
        opacity: random-range(0.7, $base-opacity, $i);

        @if $type =="flake" {
          top: -8 * 1%;
          width: #{random-range(3, 8, $i)}px;
          height: #{random-range(3, 8, $i)}px;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          animation: winter-fall calc(#{random-range(12, 32, $i)}s / var(--intensity)) linear infinite,
          winter-sway-light calc(#{random-range(2, 5, $i)}s / var(--intensity)) ease-in-out infinite alternate;
          animation-delay: -#{random-range(0, 32, $i)}s;
        }

        @if $type =="flake-cluster" {
          top: -10 * 1%;
          width: #{random-range(9, 16, $i)}px;
          height: #{random-range(9, 16, $i)}px;

          &::before,
          &::after {
            content: '';
            position: absolute;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
          }

          &::before {
            width: 65%;
            height: 65%;
            top: 0;
            left: 20%;
          }

          &::after {
            width: 45%;
            height: 45%;
            bottom: 10%;
            right: 10%;
          }

          animation: winter-drift calc(#{random-range(15, 35, $i)}s / var(--intensity)) linear infinite;
          animation-delay: -#{random-range(0, 35, $i)}s;
        }

        @if $type =="frost" {
          top: random-range(0, 30, $i) * 1%;
          width: #{random-range(10, 25, $i)}px;
          height: #{random-range(10, 25, $i)}px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 50% 50% 30% 30%;

          &::before,
          &::after {
            content: '';
            position: absolute;
            background-color: rgba(255, 255, 255, 0.5);
          }

          &::before {
            width: 1px;
            height: 60%;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
          }

          &::after {
            width: 60%;
            height: 1px;
            top: 50%;
            left: 20%;
            transform: translateY(-50%);
          }

          animation: winter-sway calc(#{random-range(8, 15, $i)}s / var(--intensity)) ease-in-out infinite alternate;
          animation-delay: -#{random-range(0, 15, $i)}s;
        }
      }
    }
  }
}

// 所有动画关键帧
@keyframes spring-float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: 0.8;
  }

  90% {
    opacity: 0.8;
  }

  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes spring-rise {
  0% {
    transform: translateY(0) scale(0.3);
    opacity: 0;
  }

  20% {
    opacity: 0.8;
  }

  80% {
    opacity: 0.8;
  }

  100% {
    transform: translateY(-110vh) scale(1.2);
    opacity: 0;
  }
}

@keyframes summer-rise {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }

  20% {
    opacity: 0.8;
  }

  80% {
    opacity: 0.8;
  }

  100% {
    transform: translateY(-110vh) scale(1.5);
    opacity: 0;
  }
}

@keyframes summer-ray {
  0% {
    transform: rotate(#{random-range(-45, 45)}) scaleX(0);
    opacity: 0;
  }

  20% {
    opacity: 0.5;
  }

  80% {
    opacity: 0.5;
  }

  100% {
    transform: rotate(#{random-range(-45, 45)}) scaleX(1);
    opacity: 0;
  }
}

@keyframes summer-fly {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0;
  }

  10% {
    opacity: 0.6;
  }

  90% {
    opacity: 0.6;
  }

  100% {
    transform: translateX(calc(100vw + 50px)) translateY(#{random-range(-200, 200)}px);
    opacity: 0;
  }
}

@keyframes summer-pulse {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.2);
  }
}

@keyframes summer-bob {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-5px);
  }
}

@keyframes autumn-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: 0.9;
  }

  90% {
    opacity: 0.9;
  }

  100% {
    transform: translateY(110vh) rotate(600deg);
    opacity: 0;
  }
}

@keyframes autumn-sway {
  0% {
    transform: translateY(0) rotate(0deg) translateX(0);
    opacity: 0;
  }

  10% {
    opacity: 0.9;
  }

  50% {
    transform: translateY(50vh) rotate(180deg) translateX(#{random-range(-100, 100)}px);
  }

  90% {
    opacity: 0.9;
  }

  100% {
    transform: translateY(110vh) rotate(360deg) translateX(#{random-range(-200, 200)}px);
    opacity: 0;
  }
}

@keyframes winter-fall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }

  10% {
    opacity: 0.9;
  }

  90% {
    opacity: 0.9;
  }

  100% {
    transform: translateY(110vh) translateX(#{random-range(-100, 100)}px);
    opacity: 0;
  }
}

@keyframes winter-drift {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: 0.8;
  }

  90% {
    opacity: 0.8;
  }

  100% {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes winter-sway {
  from {
    transform: rotate(-10deg) translateX(0);
  }

  to {
    transform: rotate(10deg) translateX(10px);
  }
}

@keyframes winter-sway-light {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(8px);
  }
}

@media (max-width: 768px) {
  .seasonal-container .particle {
    transform: scale(0.8);
  }
}
</style>