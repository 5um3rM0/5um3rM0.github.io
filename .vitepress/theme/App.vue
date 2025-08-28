<template>
  <!-- 背景图片 -->
  <Background />
  <!-- 阅读进度条 -->
  <ReadingProgress v-if="isPostPage" />
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
    <!-- 季节特效 -->
    <SeasonalEffects v-if="store.enableSeasonalEffects && currentSeason" :season="currentSeason" />
    <!-- 生日特效-->
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

// 导入阅读进度条组件
import ReadingProgress from "@/components/ReadingProgress.vue";

// 导入季节和生日相关的工具和组件
import { getCurrentSeason } from "@/utils/seasonUtils.mjs";
import SeasonalEffects from "@/components/SeasonalEffects.vue";
import BirthdayEffects from "@/components/BirthdayEffects.vue";

const route = useRoute();
const store = mainStore();
const { frontmatter, page, theme } = useData();
const { loadingStatus, footerIsShow, themeValue, themeType, backgroundType, fontFamily, fontSize } =
  storeToRefs(store);

// 右键菜单
const rightMenuRef = ref(null);

// 用于控制特效显示的 ref
const currentSeason = ref(null);
const showBirthdayEffect = ref(false);

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
  if (copiedText.trim().length > 0 && typeof $message !== "undefined") {
    $message.success("复制成功，转载注明5M茶馆谢谢喵");
  }
};

// 更改正确主题类别
const changeSiteThemeType = () => {
  const themeClasses = { dark: "dark", light: "light", auto: "auto" };
  const htmlElement = document.documentElement;
  Object.values(themeClasses).forEach((themeClass) => htmlElement.classList.remove(themeClass));
  if (themeType.value === "auto") {
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
  // 监听系统颜色
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeSiteThemeType);

  // --- 特效逻辑 ---
  // 1. 设置季节特效
  currentSeason.value = getCurrentSeason();

  // 2. 检查并触发小露的生日特效
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // 检查是否是 8月28日
  if (month === 8 && day === 28) {
    const todayStr = today.toISOString().split('T')[0]; // 获取 'YYYY-MM-DD' 格式的今天日期
    // 检查 Pinia store 中记录的日期是否不是今天
    if (store.lastBirthdayCelebrated !== todayStr) {
      showBirthdayEffect.value = true; // 触发特效显示
      store.lastBirthdayCelebrated = todayStr; // 更新 store，记录今天已经庆祝过了
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", calculateScroll);
  window.removeEventListener("contextmenu", openRightMenu);
});
</script>

<style lang="scss" scoped>
.mian-layout {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
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