import { defineStore } from "pinia";
// 从独立的配置文件中导入所有“用户可配置项”的默认值
import { siteDefaultSettings } from "../../../siteSettings.mjs";

export const mainStore = defineStore("main", {
  // state 函数定义了 store 的数据结构
  state: () => {
    return {
      // 1. 使用 ES6 扩展运算符 (...) 将所有默认设置加载到 state 中。
      //    这使得默认配置与状态逻辑完全分离，易于维护。
      ...siteDefaultSettings,
      
      // 2. 以下是网站运行时的“瞬时状态”，它们不应被持久化，
      //    每次访问都应重置为初始值。
      themeValue: "light",     // 由 JS 计算得出的当前实际主题 ('light' 或 'dark')
      loadingStatus: true,     // 页面加载状态
      scrollData: {            // 实时滚动数据
        height: 0,
        percentage: 0,
        direction: "down",
      },
      footerIsShow: false,     // 页脚是否进入视野
      
      // 所有弹窗、模态框的显示状态
      controlShow: false,
      showSettings: false,
      mobileMenuShow: false,
      
      // 其他在单次会话中可能改变的临时数据
      lastScrollY: 0,
      lastBirthdayCelebrated: null,
    };
  },
  
  // Getters 用于从 state派生出一些状态，本项目中暂未使用
  getters: {},
  
  // Actions 定义了可以被调用以改变 state 的方法
  actions: {
    /**
     * 通用的弹窗/模态框状态切换器。
     * @param {string} value - state 中要切换的布尔值属性名 (如 'controlShow')。
     * @param {boolean} blur - 是否在打开此弹窗时应用背景模糊效果。
     */
    changeShowStatus(value, blur = true) {
      this[value] = !this[value];
      // 根据弹窗的打开状态，禁止或允许页面背景滚动
      document.body.style.overflowY = this[value] ? "hidden" : "";
      // 根据 backgroundBlur 的用户设置，应用或移除全局模糊 class
      const globalApp = document.getElementById("app");
      if (globalApp) {
        this[value] && this.backgroundBlur && blur
          ? globalApp.classList.add("blur")
          : globalApp.classList.remove("blur");
      }
    },

    /**
     * 调整全局字体大小。
     * @param {boolean} isAdd - true 为增大, false 为减小。
     */
    changeFontSize(isAdd = false) {
      if (isAdd) {
        if (this.fontSize < 20) this.fontSize++;
      } else {
        if (this.fontSize > 14) this.fontSize--;
      }
      document.documentElement.style.fontSize = this.fontSize + "px";
    },

    /**
     * 循环切换明暗主题 ('auto' -> 'dark' -> 'light' -> 'auto')。
     */
    changeThemeType() {
      this.themeType === "auto"
        ? (this.themeType = "dark")
        : this.themeType === "dark"
          ? (this.themeType = "light")
          : (this.themeType = "auto");
      // 如果 $message 全局可用，则弹出提示
      if (typeof $message !== "undefined") {
        const text =
          this.themeType === "light"
            ? "浅色模式"
            : this.themeType === "dark"
              ? "深色模式"
              : "跟随系统";
        $message.info("当前主题为" + text, { duration: 1500 });
      }
    },
  },
  
  // 配置数据持久化
  persist: [
    {
      // 持久化存储的唯一键名
      key: "siteData",
      // paths 定义了哪些 state 属性需要被保存到浏览器的 localStorage 中。
      // 这里使用 Object.keys 动态获取所有在 siteDefaultSettings 中定义的键，
      // 确保只有用户的“个人偏好设置”被保存，而程序运行的“瞬时状态”不会。
      paths: Object.keys(siteDefaultSettings),
    },
  ],
});