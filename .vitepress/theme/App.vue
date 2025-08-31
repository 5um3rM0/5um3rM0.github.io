<template>
  <Background />
  <Loading />
  <Control />
  <Nav />
  <main :class="['mian-layout', { loading: loadingStatus, 'is-post': isPostPage }]">
    <Secret v-if="frontmatter.secret" />
    <Statistics v-else-if="frontmatter.layout === 'Statistics'" />
    <template v-else>
      <NotFound v-if="page.isNotFound" />
      <Home v-else-if="frontmatter.layout === 'home'" showHeader />
      <template v-else>
        <Post v-if="isPostPage" />
        <Page v-else />
      </template>
    </template>
  </main>
  <FooterLink v-show="!loadingStatus" :showBar="isPostPage && !page.isNotFound" />
  <Footer v-show="!loadingStatus" />
  <Teleport to="body">
    <div :class="['left-menu', { hidden: footerIsShow }]">
      <Settings />
    </div>
    <BirthdayEffects v-if="showBirthdayEffect" />
  </Teleport>
  <RightMenu ref="rightMenuRef" />
  <Message />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "@/store";
import { calculateScroll, specialDayGray } from "@/utils/helper";
import { onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import { isSpecialBirthday } from "@/utils/birthdayUtils.mjs";
import BirthdayEffects from "@/components/BirthdayEffects.vue";
import Secret from "@/views/Secret.vue";
import Statistics from "@/views/Statistics.vue";

const route = useRoute();
const store = mainStore();
const { frontmatter, page, theme } = useData();
const { loadingStatus, footerIsShow, themeValue, themeType, backgroundType, fontFamily, fontSize } =
  storeToRefs(store);

const rightMenuRef = ref(null);
const showBirthdayEffect = ref(false);

const createClickEffect = (event) => {
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  document.body.appendChild(ripple);
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
};

const isPostPage = computed(() => {
  const routePath = decodeURIComponent(route.path);
  return routePath.includes("/posts/");
});

const openRightMenu = (e) => {
  rightMenuRef.value?.openRightMenu(e);
};

const copyTip = () => {
  const copiedText = window.getSelection().toString();
  if (copiedText.trim().length > 0 && typeof $message !== "undefined") {
    $message.success("复制成功，转载注明5M茶馆谢谢喵");
  }
};

const changeSiteThemeType = () => {
  const themeClasses = {
    dark: "dark",
    light: "light",
    auto: "auto",
  };
  const htmlElement = document.documentElement;
  Object.values(themeClasses).forEach((themeClass) => {
    htmlElement.classList.remove(themeClass);
  });
  if (themeType.value === "auto") {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const autoThemeClass = systemPrefersDark ? themeClasses.dark : themeClasses.light;
    htmlElement.classList.add(autoThemeClass);
    themeValue.value = autoThemeClass;
  } else if (themeClasses[themeType.value]) {
    htmlElement.classList.add(themeClasses[themeType.value]);
    themeValue.value = themeClasses[themeType.value];
  }
  
  const bgTypes = ['image', 'selfie'];
  if (bgTypes.includes(backgroundType.value)) {
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

let originalFavicon = '';
const grayFaviconPath = '/images/logo/favicon-special-96x96.webp';

const handleVisibilityChange = () => {
  const favicon = document.querySelector("link[rel~='icon']");
  if (!favicon) return;
  if (document.hidden) {
    if (!originalFavicon) {
      originalFavicon = favicon.href;
    }
    favicon.href = grayFaviconPath;
  } else {
    if (originalFavicon) {
      favicon.href = originalFavicon;
    }
  }
};

watch(
  () => [themeType.value, backgroundType.value],
  () => changeSiteThemeType(),
);
watch(
  () => fontFamily.value,
  () => changeSiteFont(),
);

onMounted(() => {
  showBirthdayEffect.value = isSpecialBirthday();
  specialDayGray();
  changeSiteThemeType();
  changeSiteFont();
  window.addEventListener("scroll", calculateScroll);
  window.addEventListener("contextmenu", openRightMenu);
  window.addEventListener("copy", copyTip);
  window.addEventListener("click", createClickEffect);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeSiteThemeType);
  if (typeof window !== 'undefined') {
    const faviconElement = document.querySelector("link[rel~='icon']");
    if (faviconElement) {
      originalFavicon = faviconElement.href;
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", calculateScroll);
  window.removeEventListener("contextmenu", openRightMenu);
  window.removeEventListener("copy", copyTip);
  window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", changeSiteThemeType);
  window.removeEventListener("click", createClickEffect);
  if (typeof window !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  }
});

// onUnmounted is an alias for onBeforeUnmount in Vue 3 composition API.
// Using one is sufficient.
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