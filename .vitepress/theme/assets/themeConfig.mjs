export const themeConfig = {
  // --- 核心信息 ---
  siteMeta: {
    title: "5M茶馆",
    description: "Just 5um3rM0",
    logo: "/images/logo/logo.webp",
    site: "https://5um3rm0.github.io",
    lang: "zh-CN",
    author: {
      name: "5um3rM0",
      cover: "/images/logo/logo.webp",
      email: "n.reed2000@outlook.com",
      link: "https://5um3rM0.github.io",
    },
  },
  icp: "萌ICP备114514号",
  since: "2025-08-27",
  postSize: 8,

  // --- 头部注入 ---
  inject: {
    header: [
      ["link", { rel: "icon", href: "/favicon.ico" }],
      ["link", { crossorigin: "", rel: "preconnect", href: "https://s1.hdslb.com" }],
      ["link", { crossorigin: "", rel: "preconnect", href: "https://mirrors.sustech.edu.cn" }],
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css",
        },
      ],
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/lxgw-wenkai-screen-webfont/1.7.0/style.css",
        },
      ],
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://cdn2.codesign.qq.com/icons/g5ZpEgx3z4VO6j2/latest/iconfont.css",
        },
      ],
      ["link", { rel: "preconnect", href: "https://use.sevencdn.com" }],
      ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
      [
        "link",
        {
          crossorigin: "anonymous",
          href: "https://use.sevencdn.com/css2?family=Fira+Code:wght@300..700&display=swap",
          rel: "stylesheet",
        },
      ],
      ["link", { href: "https://X5EBEZB53I-dsn.algolia.net", rel: "preconnect", crossorigin: "" }],
    ],
  },

  // --- 导航与页脚 ---
  nav: [
    {
      text: "文库",
      items: [
        { text: "文章列表", link: "/pages/archives", icon: "article" },
        { text: "全部分类", link: "/pages/categories", icon: "folder" },
        { text: "全部标签", link: "/pages/tags", icon: "hashtag" },
      ],
    },
    {
      text: "我的",
      items: [
        { text: "关于本站", link: "/pages/about", icon: "contacts" },
        { text: "数据档案馆", link: "/pages/statistics", icon: "chart" },
      ],
    },
  ],
  navMore: [
    {
      name: "小工具",
      list: [
        {
          icon: "https://github.githubassets.com/assets/apple-touch-icon-144x144-b882e354c005.png",
          name: "博客仓库",
          url: "https://github.com/5um3rM0/5um3rM0.github.io",
        },
      ],
    },
  ],
  footer: {
    social: [
      { icon: "email", link: "mailto:n.reed2000@outlook.com" },
      { icon: "github", link: "https://www.github.com/5um3rM0/" },
    ],
    sitemap: [
      {
        text: "我的博客",
        items: [
          { text: "近期文章", link: "/" },
          { text: "全部分类", link: "/pages/categories" },
          { text: "全部标签", link: "/pages/tags" },
          { text: "文章归档", link: "/pages/archives" },
        ],
      },
      {
        text: "我的专栏",
        items: [
          { text: "碎碎念", link: "/pages/categories/碎碎念" },
          { text: "存档处", link: "/pages/categories/存档处" },
          { text: "胡思乱想", link: "/pages/categories/胡思乱想" },
          { text: "和TA的日常", link: "/pages/categories/和TA的日常" },
        ],
      },
    ],
  },

  // --- 侧边栏 ---
  aside: {
    hello: { enable: true, text: "这里5M茶馆，请随便坐坐吧~" },
    toc: { enable: true },
    tags: { enable: true },
    countDown: { enable: true, data: { name: "高考", date: "2026-06-07" } },
    siteData: { enable: true },
  },

  // --- 必要的功能插件 ---
  fancybox: {
    enable: true,
    js: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.umd.min.js",
    css: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.min.css",
  },
  jumpRedirect: {
    enable: true,
    exclude: [
      "cf-friends-link",
      "upyun",
      "icp",
      "author",
      "power",
      "social-link",
      "link-text",
      "travellings",
      "post-link",
      "report",
      "more-link",
      "skills-item",
      "right-menu-link",
      "link-card",
    ],
  },
};
