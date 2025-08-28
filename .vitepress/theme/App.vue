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
    <!-- 季节特效 (已更新 v-if 的变量名) -->
    <SeasonalEffects v-if="store.seasonalEffects && currentSeason" :season="currentSeason" />
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
import ReadingProgress from "@/components/ReadingProgress.vue";
import { getCurrentSeason } from "@/utils/seasonUtils.mjs";
import SeasonalEffects from "@/components/SeasonalEffects.vue";
import BirthdayEffects from "@/components/BirthdayEffects.vue";

const route = useRoute();
const store = mainStore();
const { frontmatter, page, theme } = useData();
// 注意：这里没有解构 seasonalEffects，因为我们在 v-if 中直接使用 store.seasonalEffects
const { loadingStatus, footerIsShow, themeValue, themeType, backgroundType, fontFamily, fontSize } =
  storeToRefs(store);

const rightMenuRef = ref(null);
const currentSeason = ref(null);
const showBirthdayEffect = ref(false);

const isPostPage = computed(() => {
  const routePath = decodeURIComponent(route.path);
  return routePath.includes("/posts/");
});

const openRightMenu = (e) => rightMenuRef.value?.openRightMenu(e);

const copyTip = () => {
  const copiedText = window.getSelection().toString();
  if (copiedText.trim().length > 0 && typeof $message !== "undefined") {
    $message.success("复制成功，转载注明5M茶馆谢谢喵");
  }
};

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

watch(() => [themeType.value, backgroundType.value], () => changeSiteThemeType());
watch(() => fontFamily.value, () => changeSiteFont());

onMounted(() => {
  specialDayGray();
  changeSiteThemeType();
  changeSiteFont();
  window.addEventListener("scroll", calculateScroll);
  window.addEventListener("contextmenu", openRightMenu);
  window.addEventListener("copy", copyTip);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeSiteThemeType);

  // --- 特效逻辑 ---
  currentSeason.value = getCurrentSeason();
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  if (month === 8 && day === 28) {
    const todayStr = today.toISOString().split('T')[0];
    if (store.lastBirthdayCelebrated !== todayStr) {
      showBirthdayEffect.value = true;
      store.lastBirthdayCelebrated = todayStr;
    }
  }

  // --- 关键诊断代码 (已更新变量名) ---
  console.log('季节特效诊断:', {
    开关是否开启: store.seasonalEffects,
    当前季节是: currentSeason.value
  });
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