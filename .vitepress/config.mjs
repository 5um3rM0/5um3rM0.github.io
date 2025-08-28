import { withPwa } from "@vite-pwa/vitepress";
import { createRssFile } from "./theme/utils/generateRSS.mjs";
import {
  getAllPosts,
  getAllType,
  getAllCategories,
  getAllArchives,
} from "./theme/utils/getPostData.mjs";
import { jumpRedirect } from "./theme/utils/commonTools.mjs";
import { getThemeConfig } from "./init.mjs";
import markdownConfig from "./theme/utils/markdownConfig.mjs";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import path from "path";

// 获取全局数据
const postData = await getAllPosts();

// 获取主题配置
const themeConfig = await getThemeConfig();

// https://vitepress.dev/reference/site-config
// 使用 withPwa 包裹一个配置对象，不再使用 defineConfig
export default withPwa({
  // ---------------------------------------------
  // --- 所有 VitePress 配置直接写在这里 ---
  // ---------------------------------------------
  title: themeConfig.siteMeta.title,
  description: themeConfig.siteMeta.description,
  lang: themeConfig.siteMeta.lang,
  cleanUrls: true,
  lastUpdated: true,
  appearance: "dark",
  head: themeConfig.inject.header,
  sitemap: {
    hostname: themeConfig.siteMeta.site,
  },
  themeConfig: {
    ...themeConfig,
    postData: postData,
    tagsData: getAllType(postData),
    categoriesData: getAllCategories(postData),
    archivesData: getAllArchives(postData),
  },
  markdown: {
    math: true,
    lineNumbers: true,
    toc: { level: [1, 2, 3] },
    image: {
      lazyLoading: true,
    },
    config: (md) => markdownConfig(md, themeConfig),
  },
  srcExclude: ["**/README.md", "**/TODO.md"],
  transformPageData: async (pageData) => {
    const canonicalUrl = `${themeConfig.siteMeta.site}/${pageData.relativePath}`
      .replace(/index\.md$/, "")
      .replace(/\.md$/, "");
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(["link", { rel: "canonical", href: canonicalUrl }]);
  },
  transformHtml: (html) => {
    return jumpRedirect(html, themeConfig);
  },
  buildEnd: async (config) => {
    await createRssFile(config, themeConfig);
  },
  vite: {
    plugins: [
      AutoImport({
        imports: ["vue", "vitepress"],
        dts: ".vitepress/auto-imports.d.ts",
      }),
      Components({
        dirs: [".vitepress/theme/components", ".vitepress/theme/views"],
        extensions: ["vue", "md"],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: ".vitepress/components.d.ts",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(new URL(import.meta.url).pathname, '..', "./theme"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    server: {
      port: 9877,
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"],
        },
      },
    },
  },

  // ---------------------------------------------
  // --- PWA 配置作为 withPwa 的一部分 ---
  // ---------------------------------------------
  pwa: {
    outDir: '.vitepress/dist', // 明确指定 PWA 插件的输出目录
    registerType: "autoUpdate",
    selfDestroying: true,
    workbox: {
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /(.*?)\.(woff2|woff|ttf|css)/,
          handler: "CacheFirst",
          options: { cacheName: "file-cache" },
        },
        {
          urlPattern: /(.*?)\.(ico|webp|png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
          handler: "CacheFirst",
          options: { cacheName: "image-cache" },
        },
        {
          urlPattern: /^https:\/\/cdn2\.codesign\.qq\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "iconfont-cache",
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 2 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
      globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,gif,svg,woff2,ttf}"],
      navigateFallbackDenylist: [/^\/sitemap.xml$/, /^\/rss.xml$/, /^\/robots.txt$/],
    },
    manifest: {
      name: themeConfig.siteMeta.title,
      short_name: themeConfig.siteMeta.title,
      description: themeConfig.siteMeta.description,
      display: "standalone",
      start_url: "/",
      theme_color: "#fff",
      background_color: "#efefef",
      icons: [
        { src: "/images/logo/favicon-32x32.webp", sizes: "32x32", type: "image/webp" },
        { src: "/images/logo/favicon-96x96.webp", sizes: "96x96", type: "image/webp" },
        { src: "/images/logo/favicon-256x256.webp", sizes: "256x256", type: "image/webp" },
        { src: "/images/logo/favicon-512x512.webp", sizes: "512x512", type: "image/webp" },
      ],
    },
  },
});