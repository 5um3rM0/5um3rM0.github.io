import { generateSW } from 'workbox-build';
import path from 'path';
import fs from 'fs-extra';

/**
 * 手动生成 Service Worker 和 Manifest
 * @param {object} themeConfig - 您的主题配置
 * @param {string} outDir - VitePress 的输出目录
 */
export async function generatePWA(themeConfig, outDir) {
  // --- 1. 生成 manifest.webmanifest ---
  const manifest = {
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
  };
  // 确保输出目录存在
  await fs.ensureDir(outDir);
  // 写入 manifest 文件
  await fs.writeFile(path.resolve(outDir, 'manifest.webmanifest'), JSON.stringify(manifest));
  console.log('PWA Manifest generated.');

  // --- 2. 生成 sw.js (Service Worker) ---
  await generateSW({
    // 这是 Service Worker 最终生成的位置
    swDest: path.join(outDir, 'sw.js'),
    // 这是需要被缓存的文件的根目录
    globDirectory: outDir,
    // 需要缓存的文件匹配规则
    globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,gif,svg,woff2,ttf}"],
    // 运行时缓存配置 (从您原来的配置迁移)
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
    // 不希望被 Service Worker 拦截的路径
    navigateFallbackDenylist: [/^\/sitemap.xml$/, /^\/rss.xml$/, /^\/robots.txt$/],
    // Workbox 的其他核心配置
    clientsClaim: true,
    skipWaiting: true,
    cleanupOutdatedCaches: true,
  });
  console.log('Service Worker generated.');
}