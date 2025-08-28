<template>
  <div 
    :class="['seasonal-container', season, { 'interactive': interactive }]"
    :style="[
      { opacity: isVisible ? 1 : 0 },
      interactive ? { 
        '--mouse-x': `${mousePosition.x * 100}%`,
        '--mouse-y': `${mousePosition.y * 100}%`,
        '--intensity': intensity
      } : {}
    ]"
    @mousemove="handleMouseMove"
  >
    <div 
      v-for="i in particleCount" 
      :key="i" 
      class="particle"
      :data-index="i"
    ></div>
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
  interactive: {
    type: Boolean,
    default: true
  },
  intensity: {
    type: Number,
    default: 1,
    validator: (value) => value >= 0.5 && value <= 2
  }
});

const isVisible = ref(false);
const mousePosition = ref({ x: 0.5, y: 0.5 }); // 初始在中心

// 组件挂载时渐入
onMounted(() => {
  isVisible.value = true;
});

// 季节变化时添加过渡效果
watch(() => props.season, () => {
  isVisible.value = false;
  setTimeout(() => {
    isVisible.value = true;
  }, 500);
});

// 只更新鼠标位置，不直接操作DOM
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

.seasonal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
  overflow: hidden;
  transition: opacity 0.5s ease-in-out;
  
  // 定义CSS变量默认值
  --mouse-x: 50%;
  --mouse-y: 50%;
  --intensity: 1;
  
  .particle {
    position: absolute;
    transition: transform 0.3s ease-out;
  }

  // 工具函数：生成随机范围值
  @function random-range($min, $max) {
    @return $min + math.random() * ($max - $min);
  }

  // 鼠标交互效果 - 完全由CSS处理
  &.interactive {
    .particle {
      // 根据粒子位置和鼠标位置计算偏移量
      --offset-x: calc(
        (var(--mouse-x) - 50%) * var(--intensity) * 
        (0.5 - abs(#{random-range(-0.5, 0.5)})) * 0.1
      );
      --offset-y: calc(
        (var(--mouse-y) - 50%) * var(--intensity) * 
        (0.5 - abs(#{random-range(-0.5, 0.5)})) * 0.1
      );
      
      // 每隔一定数量的粒子应用交互效果（随机选择）
      @if math.random() > 0.7 {
        transform: translate(var(--offset-x), var(--offset-y));
      }
    }
  }

  // 春天：花瓣和嫩芽
  &.spring {
    .particle {
      @for $i from 1 through 100 {
        &:nth-child(#{$i}) {
          $type: if(math.random() > 0.7, "bud", "petal");
          left: random-range(0, 100) * 1%;
          top: -10%;
          opacity: random-range(0.5, 0.8);
          
          @if $type == "petal" {
            width: #{random-range(6, 12)}px;
            height: #{random-range(6, 12)}px;
            background-color: if(math.random() > 0.5, #ffccd5, #e6f7e9);
            border-radius: 80% 0 80% 0;
            transform: rotate(#{random-range(0, 360)}deg);
            animation: spring-float #{random-range(12, 25) / $intensity}s linear infinite;
            animation-delay: -#{random-range(0, 25)}s;
          }
          
          @if $type == "bud" {
            width: #{random-range(3, 6)}px;
            height: #{random-range(8, 15)}px;
            background: linear-gradient(to bottom, #8bc34a, #4caf50);
            border-radius: 0 0 5px 5px;
            animation: spring-rise #{random-range(15, 30) / $intensity}s linear infinite;
            animation-delay: -#{random-range(0, 30)}s;
          }
        }
      }
    }
  }

  // 夏天：阳光、飞鸟和光斑
  &.summer {
    .particle {
      @for $i from 1 through 100 {
        &:nth-child(#{$i}) {
          $type: if(math.random() > 0.8, "bird", 
                if(math.random() > 0.7, "sunray", "glow"));
          left: random-range(0, 100) * 1%;
          opacity: 0;
          
          @if $type == "glow" {
            bottom: -15%;
            width: #{random-range(15, 40)}px;
            height: #{random-range(15, 40)}px;
            background: radial-gradient(circle, 
                      rgba(255, 240, 150, random-range(0.4, 0.7)) 0%, 
                      rgba(255, 223, 100, 0) 70%);
            border-radius: 50%;
            animation: summer-rise #{random-range(20, 40) / $intensity}s linear infinite;
            animation-delay: -#{random-range(0, 40)}s;
          }
          
          @if $type == "sunray" {
            top: random-range(5, 20) * 1%;
            right: -5%;
            width: #{random-range(100, 200)}px;
            height: 2px;
            background: linear-gradient(to right, 
                      rgba(255, 223, 100, 0), 
                      rgba(255, 223, 100, random-range(0.2, 0.5)), 
                      rgba(255, 223, 100, 0));
            transform-origin: left center;
            transform: rotate(#{random-range(-45, 45)}deg);
            animation: summer-ray #{random-range(30, 60) / $intensity}s linear infinite;
            animation-delay: -#{random-range(0, 60)}s;
          }
          
          @if $type == "bird" {
            top: random-range(10, 30) * 1%;
            left: -10%;
            width: #{random-range(15, 30)}px;
            height: #{random-range(5, 10)}px;
            border-radius: 50% / 30%;
            background-color: rgba(50, 50, 50, random-range(0.3, 0.6));
            animation: summer-fly #{random-range(40, 80) / $intensity}s linear infinite;
            animation-delay: -#{random-range(0, 80)}s;
            
            &::before, &::after {
              content: '';
              position: absolute;
              background-color: inherit;
              width: 60%;
              height: 100%;
              border-radius: 50%;
            }
            
            &::before {
              top: -40%;
              left: 0;
              transform: rotate(-30deg);
            }
            
            &::after {
              top: -40%;
              right: 0;
              transform: rotate(30deg);
            }
          }
        }
      }
    }
  }

  // 秋天：落叶和果实
  &.autumn {
    .particle {
      @for $i from 1 through 100 {
        &:nth-child(#{$i}) {
          $type: if(math.random() > 0.85, "fruit", "leaf");
          left: random-range(0, 100) * 1%;
          top: -10%;
          opacity: random-range(0.7, 0.9);
          
          @if $type == "leaf" {
            width: #{random-range(12, 20)}px;
            height: #{random-range(10, 18)}px;
            background-color: if(math.random() > 0.7, 
                              if(math.random() > 0.5, #d97706, #b45309),
                              if(math.random() > 0.5, #f59e0b, #ea580c));
            border-radius: 10% 70% 30% 60%;
            transform: rotate(#{random-range(0, 360)}deg);
            animation: autumn-fall #{random-range(10, 25) / $intensity}s linear infinite;
            animation-delay: -#{random-range(0, 25)}s;
            
            &::before {
              content: '';
              position: absolute;
              width: 60%;
              height: 2px;
              background-color: rgba(0,0,0,0.2);
              top: 50%;
              left: 20%;
              transform: rotate(#{random-range(-30, 30)}deg);
            }
          }
          
          @if $type == "fruit" {
            width: #{random-range(6, 12)}px;
            height: #{random-range(6, 12)}px;
            background-color: if(math.random() > 0.5, #dc2626, #9b2226);
            border-radius: 50%;
            
            &::before {
              content: '';
              position: absolute;
              width: 8px;
              height: 2px;
              background-color: #4b5563;
              top: -2px;
              left: 30%;
              transform: rotate(45deg);
            }
            
            animation: autumn-sway #{random-range(8, 18) / $intensity}s linear infinite;
            animation-delay: -#{random-range(0, 18)}s;
          }
        }
      }
    }
  }

  // 冬天：雪花、冰晶和雾气
  &.winter {
    .particle {
      @for $i from 1 through 100 {
        &:nth-child(#{$i}) {
          $type: if(math.random() > 0.8, "frost", 
                if(math.random() > 0.7, "flake-cluster", "flake"));
          left: random-range(0, 100) * 1%;
          opacity: random-range(0.6, 0.9);
          
          @if $type == "flake" {
            top: -5%;
            width: #{random-range(2, 7)}px;
            height: #{random-range(2, 7)}px;
            background-color: white;
            border-radius: 50%;
            animation: winter-fall #{random-range(10, 30) / $intensity}s linear infinite;
            animation-delay: -#{random-range(0, 30)}s;
          }
          
          @if $type == "flake-cluster" {
            top: -8%;
            width: #{random-range(8, 15)}px;
            height: #{random-range(8, 15)}px;
            
            &::before, &::after {
              content: '';
              position: absolute;
              background-color: white;
              border-radius: 50%;
            }
            
            &::before {
              width: 60%;
              height: 60%;
              top: 0;
              left: 20%;
            }
            
            &::after {
              width: 40%;
              height: 40%;
              bottom: 10%;
              right: 10%;
            }
            
            animation: winter-drift #{random-range(15, 35) / $intensity}s linear infinite;
            animation-delay: -#{random-range(0, 35)}s;
          }
          
          @if $type == "frost" {
            top: random-range(0, 30) * 1%;
            width: #{random-range(10, 25)}px;
            height: #{random-range(10, 25)}px;
            border: 1px solid rgba(255, 255, 255, 0.7);
            border-radius: 50% 50% 30% 30%;
            
            &::before, &::after {
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
            
            animation: winter-sway #{random-range(8, 15) / $intensity}s ease-in-out infinite alternate;
            animation-delay: -#{random-range(0, 15)}s;
          }
        }
      }
    }
  }
}

// 动画关键帧保持不变
@keyframes spring-float {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

@keyframes spring-rise {
  0% { transform: translateY(0) scale(0.3); opacity: 0; }
  20% { opacity: 0.8; }
  80% { opacity: 0.8; }
  100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
}

@keyframes summer-rise {
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  20% { opacity: 0.8; }
  80% { opacity: 0.8; }
  100% { transform: translateY(-110vh) scale(1.5); opacity: 0; }
}

@keyframes summer-ray {
  0% { transform: rotate(#{random-range(-45, 45)}deg) scaleX(0); opacity: 0; }
  20% { opacity: 0.5; }
  80% { opacity: 0.5; }
  100% { transform: rotate(#{random-range(-45, 45)}deg) scaleX(1); opacity: 0; }
}

@keyframes summer-fly {
  0% { transform: translateX(0) translateY(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateX(calc(100vw + 50px)) translateY(#{random-range(-200, 200)}px); opacity: 0; }
}

@keyframes autumn-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.9; }
  90% { opacity: 0.9; }
  100% { transform: translateY(110vh) rotate(600deg); opacity: 0; }
}

@keyframes autumn-sway {
  0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 0; }
  10% { opacity: 0.9; }
  50% { transform: translateY(50vh) rotate(180deg) translateX(#{random-range(-100, 100)}px); }
  90% { opacity: 0.9; }
  100% { transform: translateY(110vh) rotate(360deg) translateX(#{random-range(-200, 200)}px); opacity: 0; }
}

@keyframes winter-fall {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.9; }
  90% { opacity: 0.9; }
  100% { transform: translateY(110vh) translateX(#{random-range(-100, 100)}px); opacity: 0; }
}

@keyframes winter-drift {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
}

@keyframes winter-sway {
  from { transform: rotate(-10deg) translateX(0); }
  to { transform: rotate(10deg) translateX(10px); }
}

// 响应式调整
@media (max-width: 768px) {
  .seasonal-container {
    .particle {
      transform: scale(0.8);
    }
  }
}
</style>
