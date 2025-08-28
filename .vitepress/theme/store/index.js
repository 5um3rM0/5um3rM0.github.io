import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state: () => {
    return {
      // 主题类别
      themeType: "auto",
      themeValue: "light",
      // banner
      bannerType: "half",
      // 加载状态
      loadingStatus: true,
      // 滚动高度
      scrollData: {
        // 滚动高度
        height: 0,
        // 滚动百分比
        percentage: 0,
        // 滚动方向
        direction: "down",
      },
      // 页脚可见性
      footerIsShow: false,
      // 中控台显示
      controlShow: false,
      // 搜索框显示
      searchShow: false,
      // 个性化配置显示
      showSettings: false,
      // 移动端菜单显示
      mobileMenuShow: false,
      // 使用自定义右键菜单
      useRightMenu: true,
      // 背景模糊
      backgroundBlur: false,
      // 全站字体
      fontFamily: "lxgw",
      // 全站字体大小
      fontSize: 18,
      // 信息显示位置
      infoPosition: "fixed",
      // 上次滚动位置
      lastScrollY: 0,
      // 站点背景
      backgroundType: "image",
      backgroundUrl: "https://t.alcy.cc/fj",
      // 季节特效
      seasonalEffects: true,
      // 生日判断
      lastBirthdayCelebrated: null,
      // 季节特效配置
      effectsSettings: {
        particleCount: 60,  // 粒子数量 (默认值)
        interactive: true,    // 是否开启鼠标互动 (默认值)
        intensity: 1.2,     // 互动强度 (默认值)
      },
    };
  },
  getters: {},
  actions: {
    // 切换应用状态
    changeShowStatus(value, blur = true) {
      this[value] = !this[value];
      // 阻止滚动
      document.body.style.overflowY = this[value] ? "hidden" : "";
      // 全局模糊
      const globalApp = document.getElementById("app");
      this[value] && this.backgroundBlur && blur
        ? globalApp.classList.add("blur")
        : globalApp.classList.remove("blur");
    },
    // 更改字体大小
    changeFontSize(isAdd = false) {
      if (isAdd) {
        if (this.fontSize < 20) {
          this.fontSize++;
        }
      } else {
        if (this.fontSize > 14) {
          this.fontSize--;
        }
      }
      const htmlElement = document.documentElement;
      htmlElement.style.fontSize = this.fontSize + "px";
    },
    // 切换明暗模式
    changeThemeType() {
      // 禁止壁纸模式切换
      if (this.backgroundType === "image") {
        $message.warning("无法在壁纸模式下切换明暗模式", {
          duration: 1500,
        });
        return false;
      }
      this.themeType === "auto"
        ? (this.themeType = "dark")
        : this.themeType === "dark"
          ? (this.themeType = "light")
          : (this.themeType = "auto");
      // 弹窗提示
      if (typeof $message !== "undefined") {
        const text =
          this.themeType === "light"
            ? "浅色模式"
            : this.themeType === "dark"
              ? "深色模式"
              : "跟随系统";
        $message.info("当前主题为" + text, {
          duration: 1500,
        });
      }
    },
  },
  // 数据持久化
  persist: [
    {
      key: "siteData",
      paths: [
        "themeType",
        "bannerType",
        "useRightMenu",
        "playerShow",
        "playerVolume",
        "backgroundBlur",
        "backgroundType",
        "fontFamily",
        "fontSize",
        "infoPosition",
        "backgroundUrl",
        "seasonalEffects",
        "lastBirthdayCelebrated",
        "effectsSettings",
      ],
    },
  ],
});
