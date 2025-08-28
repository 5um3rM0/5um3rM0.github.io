<template>
    <div :class="['seasonal-container', season]">
        <div v-for="i in 50" :key="i" class="particle"></div>
    </div>
</template>

<script setup>
defineProps({ season: { type: String, required: true } });
</script>

<style lang="scss" scoped>
@use "sass:math";

.seasonal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 999;
    overflow: hidden
}

.particle {
    position: absolute;
    opacity: 0
}

@function random_range($min, $max) {
    $rand: math.random();
    @return $min+math.floor($rand*(($max - $min)+1))
}

.seasonal-container {
    &.spring .particle {
        top: -20px;
        width: 10px;
        height: 10px;
        background-color: #ffc0cb;
        border-radius: 1px 50%;
        opacity: .8;
        animation: drift 15s linear infinite;
        left:#{random_range(0,100)}vw;

        @for $i from 1 through 50 {
            &:nth-child(#{$i}) {
                animation-duration:#{random_range(15,30)}s;
                animation-delay:-#{random_range(0,30)}s
            }
        }
    }

    &.summer .particle {
        bottom: -20px;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255, 223, 100, .6) 0%, rgba(255, 223, 100, 0) 70%);
        border-radius: 50%;
        opacity: 0;
        animation: rise 20s linear infinite;
        left:#{random_range(0,100)}vw;

        @for $i from 1 through 50 {
            &:nth-child(#{$i}) {
                $size: #{random_range(10,50)}px;
                width: $size;
                height: $size;
                animation-duration:#{random_range(20,40)}s;
                animation-delay:-#{random_range(0,40)}s
            }
        }
    }

    &.autumn .particle {
        top: -20px;
        width: 15px;
        height: 15px;
        background-color: #d95b00;
        border-radius: 1px 50%;
        opacity: .9;
        animation: flutter 10s linear infinite;
        left:#{random_range(0,100)}vw;

        &:nth-child(2n) {
            background-color: #a63c00
        }

        @for $i from 1 through 50 {
            &:nth-child(#{$i}) {
                animation-duration:#{random_range(10,25)}s;
                animation-delay:-#{random_range(0,25)}s
            }
        }
    }

    &.winter .particle {
        top: -10px;
        width: 5px;
        height: 5px;
        background-color: white;
        border-radius: 50%;
        opacity: .7;
        animation: fall 10s linear infinite;
        left:#{random_range(0,100)}vw;

        @for $i from 1 through 50 {
            &:nth-child(#{$i}) {
                $size: #{random_range(2,7)}px;
                width: $size;
                height: $size;
                animation-duration:#{random_range(10,30)}s;
                animation-delay:-#{random_range(0,30)}s
            }
        }
    }
}

@keyframes drift {
    to {
        transform: translateY(105vh) rotate(720deg)
    }
}

@keyframes rise {
    0% {
        transform: translateY(0);
        opacity: 0
    }

    50% {
        opacity: 1
    }

    100% {
        transform: translateY(-105vh);
        opacity: 0
    }
}

@keyframes flutter {
    to {
        transform: translateY(105vh) rotate(600deg)
    }
}

@keyframes fall {
    to {
        transform: translateY(105vh)
    }
}
</style>