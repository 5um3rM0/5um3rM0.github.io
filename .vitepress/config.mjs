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
  transformHtml: (html) => {
    return jumpRedirect(html, themeConfig);
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