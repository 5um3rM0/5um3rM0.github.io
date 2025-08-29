<template>
  <!-- 背景图片 -->
  <Background />
  <!-- 加载提示 -->
  <Loading />
  <!-- 中控台 -->
  <Control />
  <!-- 导航栏 -->
  <Nav />
  <!-- 主内容 -->
  <main :class="['mian-layout', { loading: loadingStatus, 'is-post': isPostPage }]">
    <!-- 404 -->
    <NotFound v-if="page.isNotFound" />
    <!-- 首页 -->
    <Home v-if="frontmatter.layout === 'home'" showHeader />
    <!-- 页面 -->
    <template v-else>
      <!-- 文章页面 -->
      <Post v-if="isPostPage" />
      <!-- 普通页面 -->
      <Page v-else-if="!page.isNotFound" />
    </template>
  </main>
  <!-- 页脚 -->
  <FooterLink v-show="!loadingStatus" :showBar="isPostPage && !page.isNotFound" />
  <Footer v-show="!loadingStatus" />
  <!-- 悬浮菜单 -->
  <Teleport to="body">
    <!-- 左侧菜单 -->
    <div :class="['left-menu', { hidden: footerIsShow }]">
      <!-- 全局设置 -->
      <Settings />
    </div>
    <!-- 生日特效 -->
    <BirthdayEffects v-if="showBirthdayEffect" />
  </Teleport>
  <!-- 右键菜单 -->
  <RightMenu ref="rightMenuRef" />
  <!-- 全局消息 -->
  <Message />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "@/store";
import { calculateScroll, specialDayGray } from "@/utils/helper";
import { isSpecialBirthday } from "@/utils/birthdayUtils.mjs";
import BirthdayEffects from "@/components/BirthdayEffects.vue";

const route = useRoute();
const store = mainStore();
const { frontmatter, page, theme } = useData();
const { loadingStatus, footerIsShow, themeValue, themeType, backgroundType, fontFamily, fontSize } =
  storeToRefs(store);

// 右键菜单
const rightMenuRef = ref(null);

const showBirthdayEffect = ref(false);

const clickEffects = ["❤", "赛马娘", "好看", "自由", "平等", "博爱", "法治", "正义", "劳动", "民族", "民权", "民生"];
let effectIndex = 0;

const createClickEffect = (event) => {
  // 创建一个新元素
  const effect = document.createElement('span');
  effect.style.position = 'fixed'; // 使用 fixed 定位，相对于浏览器窗口
  effect.style.left = `${event.clientX}px`; // X 坐标
  effect.style.top = `${event.clientY}px`;  // Y 坐标
  effect.style.zIndex = '9999';
  effect.style.fontSize = '20px';
  effect.style.fontWeight = 'bold';
  effect.style.pointerEvents = 'none'; // 确保特效不会干扰鼠标事件
  effect.style.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`; // 随机颜色
  
  // 设置内容
  effect.textContent = clickEffects[effectIndex];
  effectIndex = (effectIndex + 1) % clickEffects.length; // 循环使用数组中的内容
  
  document.body.appendChild(effect);
  
  // 添加动画
  effect.animate([
    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
    { transform: 'translate(-50%, -150%) scale(1.5)', opacity: 0 }
  ], {
    duration: 1000,
    easing: 'ease-out'
  }).onfinish = () => {
    effect.remove();
  };
};

// 判断是否为文章页面
const isPostPage = computed(() => {
  const routePath = decodeURIComponent(route.path);
  return routePath.includes("/posts/");
});

// 开启右键菜单
const openRightMenu = (e) => {
  rightMenuRef.value?.openRightMenu(e);
};

// 复制时触发
const copyTip = () => {
  const copiedText = window.getSelection().toString();
  // 检查文本内容是否不为空
  if (copiedText.trim().length > 0 && typeof $message !== "undefined") {
    $message.success("复制成功，转载注明5M茶馆谢谢喵");
  }
};

// 更改正确主题类别
const changeSiteThemeType = () => {
  // 主题 class
  const themeClasses = {
    dark: "dark",
    light: "light",
    auto: "auto",
  };
  // 必要数据
  const htmlElement = document.documentElement;
  console.log("当前模式：", themeType.value);
  // 清除所有 class
  Object.values(themeClasses).forEach((themeClass) => {
    htmlElement.classList.remove(themeClass);
  });
  // 添加新的 class
  if (themeType.value === "auto") {
    // 根据当前操作系统颜色方案更改明暗主题
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const autoThemeClass = systemPrefersDark ? themeClasses.dark : themeClasses.light;
    htmlElement.classList.add(autoThemeClass);
    themeValue.value = autoThemeClass;
  } else if (themeClasses[themeType.value]) {
    htmlElement.classList.add(themeClasses[themeType.value]);
    themeValue.value = themeClasses[themeType.value];
  }
  if (backgroundType.value === "image") {
    htmlElement.classList.add("image");
  } else {
    htmlElement.classList.remove("image");
  }
};

// 切换系统字体样式
const changeSiteFont = () => {
  try {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove("lxgw", "hmos");
    htmlElement.classList.add(fontFamily.value);
    htmlElement.style.fontSize = fontSize.value + "px";
  } catch (error) {
    console.error("切换系统字体样式失败", error);
  }
};

// 监听设置变化
watch(
  () => [themeType.value, backgroundType.value],
  () => changeSiteThemeType(),
);
watch(
  () => fontFamily.value,
  () => changeSiteFont(),
);

onMounted(() => {
  // 判断生日
  showBirthdayEffect.value = isSpecialBirthday();

  console.log(frontmatter.value, page.value, theme.value);
  // 全站置灰
  specialDayGray();
  // 更改主题类别
  changeSiteThemeType();
  // 切换系统字体样式
  changeSiteFont();
  // 滚动监听
  window.addEventListener("scroll", calculateScroll);
  // 右键监听
  window.addEventListener("contextmenu", openRightMenu);
  // 复制监听
  window.addEventListener("copy", copyTip);
  // 点击监听
  window.addEventListener("click", createClickEffect);
  // 监听系统颜色
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeSiteThemeType);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", calculateScroll);
  window.removeEventListener("contextmenu", openRightMenu);
  window.removeEventListener("copy", copyTip);
  window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", changeSiteThemeType);
  window.removeEventListener("click", createClickEffect); 
});
</script>

<style lang="scss" scoped>
.mian-layout {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  // 手动实现加载动画
  animation: show 0.5s forwards;
  animation-duration: 0.5s;
  display: block;

  &.loading {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;

    &.is-post {
      padding: 0;
    }
  }
}

.left-menu {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 1002;
  transition:
    opacity 0.3s,
    transform 0.3s;

  &.hidden {
    opacity: 0;
    transform: translateY(100px);
  }
}
</style>