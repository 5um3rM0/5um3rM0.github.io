<template>
  <div :class="['seasonal-container', season, { 'interactive': interactive }]" :style="[
    { opacity: isVisible ? 1 : 0 },
    { '--intensity': intensity },
    interactive ? {
      '--mouse-x': `${mousePosition.x * 100}%`,
      '--mouse-y': `${mousePosition.y * 100}%`
    } : {}
  ]" @mousemove="handleMouseMove">
    <div v-for="i in particleCount" :key="i" class="particle"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  season: { type: String, required: true, validator: (value) => ['spring', 'summer', 'autumn', 'winter'].includes(value) },
  particleCount: { type: Number, default: 50, validator: (value) => value >= 10 && value <= 100 },
  interactive: { type: Boolean, default: true },
  intensity: { type: Number, default: 1, validator: (value) => value >= 0.5 && value <= 2 }
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

// 优化方向：提升互动感知、增强视觉层次、优化性能、统一代码规范
.seasonal-container {
  // 先补充全局基础样式（确保优化代码完整性）
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 999;
  overflow: hidden;
  transition: opacity 0.5s ease-in-out;
  --intensity: 1; // 关联动态CSS变量
  --base-opacity: 0.8; // 基础透明度变量，统一控制

  .particle {
    position: absolute;
    transition: transform 0.5s ease-out; // 延长过渡，提升流畅度
    will-change: transform, opacity; // 告知浏览器提前优化渲染
  }

  // 工具函数：优化随机逻辑，避免重复（结合索引生成伪随机）
  @function random-range($min, $max, $index: 1) {
    $seed: $index * 43 + math.random() * 1000; // 固定种子，同索引随机值一致
    @return $min +(math.mod($seed, 1) * ($max - $min));
  }

  // 1. 春天特效优化：均匀分布+层次渐变
  &.spring .particle {
    @for $i from 1 through 80 {

      // 减少粒子数量（原100→80），平衡效果与性能
      &:nth-child(#{$i}) {
        $type: if(math.random() > 0.7, "bud", "petal");
        // 优化初始位置：左右5%-95%分布，避免贴边；top上移增加下落距离
        left: random-range(5, 95, $i) * 1%;
        top: -15 * 1%;
        // 透明度渐变：0.6-0.8，避免过暗
        opacity: random-range(0.6, var(--base-opacity), $i);

        @if $type =="petal" {
          // 尺寸微调：7-13px，比原6-12px稍大，提升可见度
          width: #{random-range(7, 13, $i)}px;
          height: #{random-range(7, 13, $i)}px;
          // 增加渐变：替代单色，更有层次感
          background: linear-gradient(45deg,
              if(math.random() > 0.5, #ffccd5, #ffe6ed), // 浅粉→浅粉白
              if(math.random() > 0.5, #e6f7e9, #d1fae5) // 浅绿→浅绿白
            );
          border-radius: 80% 0 80% 0;
          transform: rotate(#{random-range(0, 360, $i)}deg);
          // 动画时长：13-27s，增加随机性；结合强度动态调整
          animation: spring-float calc(#{random-range(13, 27, $i)}s / var(--intensity)) linear infinite;
          animation-delay: -#{random-range(0, 27, $i)}s;
        }

        @if $type =="bud" {
          // 尺寸微调：4-7px，比原3-6px稍大
          width: #{random-range(4, 7, $i)}px;
          height: #{random-range(9, 16, $i)}px;
          // 优化渐变：浅绿→深绿，增强立体感
          background: linear-gradient(to bottom,
              #a3e635, // 浅绿（原#8bc34a）
              #4caf50 // 深绿（不变）
            );
          border-radius: 0 0 6px 6px; // 圆润化边角
          animation: spring-rise calc(#{random-range(16, 32, $i)}s / var(--intensity)) linear infinite;
          animation-delay: -#{random-range(0, 32, $i)}s;
        }
      }
    }
  }

  // 2. 夏天特效优化：增强亮度+动态动画
  &.summer .particle {
    @for $i from 1 through 80 {

      // 粒子数量优化：100→80
      &:nth-child(#{$i}) {
        $type: if(math.random() > 0.8, "bird", if(math.random() > 0.7, "sunray", "glow"));
        left: random-range(5, 95, $i) * 1%; // 避免贴边
        opacity: 0;

        @if $type =="glow" {
          bottom: -20 * 1%; // 下移初始位置，增加上升距离
          // 尺寸放大：18-45px，比原15-40px更醒目
          width: #{random-range(18, 45, $i)}px;
          height: #{random-range(18, 45, $i)}px;
          // 增强光斑亮度：0.5-0.8（原0.4-0.7），更有夏日感
          background: radial-gradient(circle,
              rgba(255, 240, 150, random-range(0.5, 0.8, $i)) 0%,
              rgba(255, 223, 100, 0) 75% // 扩大透明范围，过渡更自然
            );
          border-radius: 50%;
          // 增加脉冲动画：模拟呼吸感，更生动
          animation: summer-rise calc(#{random-range(22, 43, $i)}s / var(--intensity)) linear infinite,
          summer-pulse calc(#{random-range(3, 6, $i)}s / var(--intensity)) ease-in-out infinite alternate;
          animation-delay: -#{random-range(0, 43, $i)}s;
        }

        @if $type =="sunray" {
          top: random-range(8, 25, $i) * 1%; // 上移初始位置
          right: -8 * 1%; // 右移初始位置，增加显示时间
          // 尺寸优化：110-220px（原100-200px），增粗高度3px（原2px）
          width: #{random-range(110, 220, $i)}px;
          height: 3px;
          // 增强光线透明度：0.3-0.6（原0.2-0.5）
          background: linear-gradient(to right,
              rgba(255, 223, 100, 0),
              rgba(255, 223, 100, random-range(0.3, 0.6, $i)),
              rgba(255, 223, 100, 0));
          transform-origin: left center;
          // 缩小旋转范围：-40-40deg（原-45-45deg），避免杂乱
          transform: rotate(#{random-range(-40, 40, $i)}deg);
          animation: summer-ray calc(#{random-range(32, 65, $i)}s / var(--intensity)) linear infinite;
          animation-delay: -#{random-range(0, 65, $i)}s;
        }

        @if $type =="bird" {
          top: random-range(12, 35, $i) * 1%; // 上移初始位置
          left: -15 * 1%; // 左移初始位置，增加飞行距离
          // 尺寸放大：18-33px（原15-30px），高度6-11px（原5-10px）
          width: #{random-range(18, 33, $i)}px;
          height: #{random-range(6, 11, $i)}px;
          border-radius: 50% / 30%;
          // 加深颜色：0.4-0.7（原0.3-0.6），更清晰
          background-color: rgba(40, 40, 40, random-range(0.4, 0.7, $i));
          // 增加起伏动画：模拟真实飞行
          animation: summer-fly calc(#{random-range(42, 85, $i)}s / var(--intensity)) linear infinite,
          summer-bob calc(#{random-range(2, 4, $i)}s / var(--intensity)) ease-in-out infinite alternate;
          animation-delay: -#{random-range(0, 85, $i)}s;

          &::before,
          &::after {
            content: '';
            position: absolute;
            background-color: inherit;
            width: 65%; // 扩大翅膀（原60%），更明显
            height: 100%;
            border-radius: 50%;
          }

          &::before {
            top: -45%; // 上移翅膀（原-40%）
            left: 0;
            transform: rotate(-35deg); // 增大角度（原-30deg）
          }

          &::after {
            top: -45%; // 上移翅膀（原-40%）
            right: 0;
            transform: rotate(35deg); // 增大角度（原30deg）
          }
        }
      }
    }
  }

  // 3. 秋天特效优化：丰富色彩+真实旋转
  &.autumn .particle {
    @for $i from 1 through 80 {

      // 粒子数量优化：100→80
      &:nth-child(#{$i}) {
        $type: if(math.random() > 0.85, "fruit", "leaf");
        left: random-range(5, 95, $i) * 1%; // 避免贴边
        top: -15 * 1%; // 上移初始位置
        opacity: random-range(0.75, var(--base-opacity), $i); // 提高基础透明度

        @if $type =="leaf" {
          // 尺寸放大：13-22px（原12-20px），高度11-20px（原10-18px）
          width: #{random-range(13, 22, $i)}px;
          height: #{random-range(11, 20, $i)}px;
          // 多色渐变：增加橙/黄/红，更有秋意
          background: linear-gradient(45deg,
              // 随机选择秋色：橙→黄→红→深红
              if(math.random() > 0.8, #9a3412, if(math.random() > 0.6, #ea580c, if(math.random() > 0.4, #f59e0b, #d97706))),
              darken(if(math.random() > 0.8, #9a3412, if(math.random() > 0.6, #ea580c, if(math.random() > 0.4, #f59e0b, #d97706))), 10%) // 暗调渐变
            );
          border-radius: 10% 70% 30% 60%;
          transform: rotate(#{random-range(0, 360, $i)}deg);
          // 动画改为ease-in-out：模拟落叶先快后慢
          animation: autumn-fall calc(#{random-range(11, 27, $i)}s / var(--intensity)) ease-in-out infinite;
          animation-delay: -#{random-range(0, 27, $i)}s;

          &::before {
            content: '';
            position: absolute;
            width: 65%; // 扩大叶脉（原60%）
            height: 2.5px; // 增粗叶脉（原2px）
            background-color: rgba(0, 0, 0, 0.3); // 加深叶脉（原0.2）
            top: 50%;
            left: 20%;
            // 扩大旋转范围：-35-35deg（原-30-30deg）
            transform: rotate(#{random-range(-35, 35, $i)}deg);
          }
        }

        @if $type =="fruit" {
          // 尺寸放大：7-13px（原6-12px）
          width: #{random-range(7, 13, $i)}px;
          height: #{random-range(7, 13, $i)}px;
          // 渐变优化：浅红→深红，增强立体
          background: linear-gradient(45deg,
              if(math.random() > 0.5, #dc2626, #e11d48), // 浅红→艳红
              if(math.random() > 0.5, #9b2226, #b91c1c) // 深红→暗红
            );
          border-radius: 50%;

          &::before {
            content: '';
            position: absolute;
            width: 9px; // 增粗果柄（原8px）
            height: 2.5px; // 增粗果柄（原2px）
            background-color: #6b7280; // 加深果柄（原#4b5563）
            top: -3px; // 上移果柄（原-2px）
            left: 30%;
            transform: rotate(45deg);
          }

          animation: autumn-sway calc(#{random-range(8, 18, $i)}s / var(--intensity)) linear infinite;
          animation-delay: -#{random-range(0, 18, $i)}s;
        }
      }
    }
  }

  // 4. 冬天特效优化：增强雪花质感+霜花细节
  &.winter .particle {
    @for $i from 1 through 80 {

      // 粒子数量优化：100→80
      &:nth-child(#{$i}) {
        $type: if(math.random() > 0.8, "frost", if(math.random() > 0.7, "flake-cluster", "flake"));
        left: random-range(5, 95, $i) * 1%; // 避免贴边
        opacity: random-range(0.7, var(--base-opacity), $i); // 提高透明度（原0.6-0.9）

        @if $type =="flake" {
          top: -8 * 1%; // 上移初始位置（原-5%）
          // 尺寸放大：3-8px（原2-7px）
          width: #{random-range(3, 8, $i)}px;
          height: #{random-range(3, 8, $i)}px;
          // 增加半透明：避免纯白刺眼
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          // 增加摇摆动画：模拟雪花飘落轨迹
          animation: winter-fall calc(#{random-range(12, 32, $i)}s / var(--intensity)) linear infinite,
          winter-sway-light calc(#{random-range(2, 5, $i)}s / var(--intensity)) ease-in-out infinite alternate;
          animation-delay: -#{random-range(0, 32, $i)}s;
        }

        @if $type =="flake-cluster" {
          top: -10 * 1%; // 上移初始位置（原-8%）
          // 尺寸放大：9-16px（原8-15px）
          width: #{random-range(9, 16, $i)}px;
          height: #{random-range(9, 16, $i)}px;

          &::before,
          &::after {
            content: '';
            position: absolute;
            // 增加半透明：统一质感
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
          }

          &::before {
            width: 65%; // 扩大子雪花（原60%）
            height: 65%; // 扩大子雪花（原60%）
            top: 0;
            left: 20%;
          }

          &::after {
            width: 45%; // 扩大子雪花（原40%）
            height: 45%; // 扩大子雪花（原40%）
            bottom: 10%;
            right: 10%;
          }
        }
      }
    }
  }
}

@keyframes spring-float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0
  }

  10% {
    opacity: .8
  }

  90% {
    opacity: .8
  }

  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0
  }
}

@keyframes spring-rise {
  0% {
    transform: translateY(0) scale(.3);
    opacity: 0
  }

  20% {
    opacity: .8
  }

  80% {
    opacity: .8
  }

  100% {
    transform: translateY(-110vh) scale(1.2);
    opacity: 0
  }
}

@keyframes summer-rise {
  0% {
    transform: translateY(0) scale(.5);
    opacity: 0
  }

  20% {
    opacity: .8
  }

  80% {
    opacity: .8
  }

  100% {
    transform: translateY(-110vh) scale(1.5);
    opacity: 0
  }
}

@keyframes summer-ray {
  0% {
    transform:rotate(#{random-range(-45,45)}deg) scaleX(0);
    opacity: 0
  }

  20% {
    opacity: .5
  }

  80% {
    opacity: .5
  }

  100% {
    transform:rotate(#{random-range(-45,45)}deg) scaleX(1);
    opacity: 0
  }
}

@keyframes summer-fly {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0
  }

  10% {
    opacity: .6
  }

  90% {
    opacity: .6
  }

  100% {
    transform:translateX(calc(100vw + 50px)) translateY(#{random-range(-200,200)}px);
    opacity: 0
  }
}

@keyframes autumn-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0
  }

  10% {
    opacity: .9
  }

  90% {
    opacity: .9
  }

  100% {
    transform: translateY(110vh) rotate(600deg);
    opacity: 0
  }
}

@keyframes autumn-sway {
  0% {
    transform: translateY(0) rotate(0deg) translateX(0);
    opacity: 0
  }

  10% {
    opacity: .9
  }

  50% {
    transform:translateY(50vh) rotate(180deg) translateX(#{random-range(-100,100)}px)
  }

  90% {
    opacity: .9
  }

  100% {
    transform:translateY(110vh) rotate(360deg) translateX(#{random-range(-200,200)}px);
    opacity: 0
  }
}

@keyframes winter-fall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0
  }

  10% {
    opacity: .9
  }

  90% {
    opacity: .9
  }

  100% {
    transform:translateY(110vh) translateX(#{random-range(-100,100)}px);
    opacity: 0
  }
}

@keyframes winter-drift {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0
  }

  10% {
    opacity: .8
  }

  90% {
    opacity: .8
  }

  100% {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0
  }
}

@keyframes winter-sway {
  from {
    transform: rotate(-10deg) translateX(0)
  }

  to {
    transform: rotate(10deg) translateX(10px)
  }
}

@media (max-width: 768px) {
  .seasonal-container .particle {
    transform: scale(.8)
  }
}
</style>