import { defineConfig } from "vitepress";
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

const postData = await getAllPosts();
const themeConfig = await getThemeConfig();

// 定义一个函数来获取当前时间戳作为版本号
function getTimestampVersion() {
  const now = new Date();
  // 格式化为 YYYY-MM-DDTHH:mm:ssZ (ISO 8601 格式)
  return now.toISOString();
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
  transformHtml: (html, id, siteConfig) => {
    let processedHtml = html; // 从原始 html 开始处理

    // 1. 应用现有的 jumpRedirect 逻辑
    processedHtml = jumpRedirect(processedHtml, themeConfig);

    // 2. 仅在构建模式下注入版本号，避免开发服务器每次都重新计算
    if (siteConfig.isBuild) {
      const version = getTimestampVersion();
      // 使用注释而不是 meta 标签，因为 meta 标签可能被某些工具移除或不被视为内容变化
      // 注释更安全，且同样能改变文件哈希
      const versionComment = `<!-- Deployment Version: ${version} -->`;

      // 查找 </head> 标签的闭合位置
      const headEndIndex = processedHtml.indexOf('</head>');

      if (headEndIndex !== -1) {
        // 在 </head> 之前插入注释
        processedHtml =
          processedHtml.slice(0, headEndIndex) +
          `\n  ${versionComment}\n` + // 插入换行和缩进，保持格式整洁
          processedHtml.slice(headEndIndex);
      }
    }

    return processedHtml;
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
        // eslint-disable-next-line no-undef
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
});