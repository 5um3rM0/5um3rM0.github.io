<template>
  <div v-if="show" class="birthday-wrapper" @click="show = false">
    <div class="effect-container">
      <div v-for="i in 100" :key="i" class="particle"></div>
    </div>
    <div class="message-box">
      <div class="message-content">
        <span class="happy-text">Happy Birthday!</span>
        <span class="name">小露</span>
        <span class="wish-text">生日快乐！！！又过一年！！！🎂</span>
        <div class="close-hint">（点击任意位置关闭）</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const show = ref(true);
</script>

<style lang="scss" scoped>
@use "sass:math";
.birthday-wrapper{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:all;z-index:9999;overflow:hidden;cursor:pointer;animation:fadeIn 1s ease-out}.message-box{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:2rem 3rem;border-radius:15px;text-align:center;color:#fff;text-shadow:0 2px 5px rgba(0,0,0,.6);background:linear-gradient(45deg,rgba(255,215,0,.7),rgba(255,105,180,.7));backdrop-filter:blur(12px);box-shadow:0 0 40px rgba(255,215,0,.8);animation:pulse 2.5s infinite,popIn .5s cubic-bezier(.68,-.55,.27,1.55)}.message-content{display:flex;flex-direction:column;align-items:center;gap:.5rem}.happy-text{font-size:2rem;font-weight:700}.name{font-size:3.5rem;font-weight:900}.wish-text{font-size:1.2rem;margin-top:.5rem}.close-hint{font-size:.8rem;margin-top:1.5rem;opacity:.7}.effect-container{width:100%;height:100%}.particle{position:absolute;border-radius:50%;opacity:0;&:nth-child(2n){top:-20px;width:8px;height:15px;border-radius:0;background-color:hsl(#{math.random(360)},90%,70%);animation:fall 8s infinite ease-out}&:nth-child(2n+1){bottom:-20px;background-color:gold;box-shadow:0 0 10px gold;animation:rise 8s infinite ease-in}@for $i from 1 through 100{&:nth-child(#{$i}){$size:math.random(10)+5px;width:$size;height:$size;left:#{math.random(100)}vw;animation-duration:#{math.random(8)+5}s;animation-delay:#{math.random(8)}s}}}
@keyframes rise{to{transform:translateY(-105vh);opacity:1}}
@keyframes fall{to{transform:translateY(105vh) rotate(360deg);opacity:1}}
@keyframes pulse{0%,to{transform:translate(-50%,-50%) scale(1);box-shadow:0 0 40px rgba(255,215,0,.8)}50%{transform:translate(-50%,-50%) scale(1.05);box-shadow:0 0 60px rgba(255,105,180,.9)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{0%{transform:translate(-50%,-50%) scale(.5);opacity:0}to{transform:translate(-50%,-50%) scale(1);opacity:1}}
</style>