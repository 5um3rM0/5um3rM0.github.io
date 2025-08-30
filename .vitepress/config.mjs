import { defineConfig } from "vitepress";
import {
  getAllPosts,
  getAllType,
  getAllCategories,
  getAllArchives,
} from "./theme/utils/getPostData.mjs";
import { generateSiteStats } from "./theme/utils/getSiteStats.mjs";
import { jumpRedirect } from "./theme/utils/commonTools.mjs";
import { getThemeConfig } from "./init.mjs";
import markdownConfig from "./theme/utils/markdownConfig.mjs";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import path from "path";

const postData = await getAllPosts();
const themeConfigData = await getThemeConfig();
const siteStats = generateSiteStats(postData);

function getTimestampVersion() {
  const now = new Date();
  return now.toISOString();
}

export default defineConfig({
  title: themeConfigData.siteMeta.title,
  description: themeConfigData.siteMeta.description,
  lang: themeConfigData.siteMeta.lang,
  cleanUrls: true,
  lastUpdated: true,
  appearance: "dark",
  head: themeConfigData.inject.header,
  sitemap: {
    hostname: themeConfigData.siteMeta.site,
  },
  themeConfig: {
    ...themeConfigData,
    postData: postData,
    tagsData: getAllType(postData),
    categoriesData: getAllCategories(postData),
    archivesData: getAllArchives(postData),
    siteStats: siteStats,
  },
  markdown: {
    math: true,
    lineNumbers: true,
    toc: { level: [1, 2, 3] },
    image: {
      lazyLoading: true,
    },
    config: (md) => markdownConfig(md, themeConfigData),
  },
  srcExclude: ["**/README.md", "**/TODO.md"],
  transformPageData: async (pageData) => {
    const canonicalUrl = `${themeConfigData.siteMeta.site}/${pageData.relativePath}`
      .replace(/index\.md$/, "")
      .replace(/\.md$/, "");
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(["link", { rel: "canonical", href: canonicalUrl }]);
  },
  transformHtml: (html, id, siteConfig) => {
    let processedHtml = html;
    processedHtml = jumpRedirect(processedHtml, themeConfigData);
    if (siteConfig.isBuild) {
      const version = getTimestampVersion();
      const versionComment = `<!-- Deployment Version: ${version} -->`;
      const headEndIndex = processedHtml.indexOf('</head>');
      if (headEndIndex !== -1) {
        processedHtml =
          processedHtml.slice(0, headEndIndex) +
          `\n  ${versionComment}\n` +
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