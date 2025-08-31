// ===================================================================
// ✨ 博客“运行时”默认设置 ✨
// 这个文件定义了所有用户可以在设置面板中动态修改的选项的“出厂默认值”。
// ===================================================================

export const siteDefaultSettings = {
  // --- 主题与外观 ---
  themeType: "auto", // 'auto', 'light', 'dark'
  fontFamily: "lxgw", // 'lxgw', 'hmos'
  fontSize: 18, // 默认字体大小 (px)

  // --- 背景设置 ---
  backgroundType: "image", // 'image', 'texture', 'selfie'
  backgroundUrl: "https://t.alcy.cc/fj", // 图片模式的默认 URL
  imageFit: "cover", // 图片填充模式 'cover', 'contain', 'fill'
  backgroundBlur: true, // 弹窗时背景是否模糊

  // --- 功能开关 ---
  useRightMenu: true, // 是否启用自定义右键菜单

  // --- 布局与信息 ---
  bannerType: "half", // 首页 Banner 高度 'half', 'full'
  infoPosition: "fixed", // 侧边栏信息显示位置 'fixed', 'normal'
};
