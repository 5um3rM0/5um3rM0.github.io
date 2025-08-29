# 5um3rM0's Blog

<p align="center">
  <img src="https://github.com/imsyy/vitepress-theme-curve/assets/42232682/bed62689-cfd8-4d98-b946-24555d4ce1fb" alt="curve-logo" />
</p>
<p align="center">
  一个经过深度个性化定制的 VitePress 博客主题
</p>

---

本项目基于优秀的开源主题 **[vitepress-theme-curve](https://github.com/imsyy/vitepress-theme-curve)** by [imsyy](https://github.com/imsyy)，并在其基础上进行了大量的二次开发与个性化定制，以打造符合个人审美和需求的博客空间。

**✨ 在线访问: [https://5um3rM0.github.io/](https://5um3rM0.github.io/)**

[![Deploy to GitHub Pages](https://github.com/5um3rM0/5um3rM0.github.io/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/5um3rM0/5um3rM0.github.io/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 项目简介

这个仓库是我个人博客的完整源码。它始于 `vitepress-theme-curve` 提供的坚实基础，我对其进行了包括但不限于以下方面的定制：

-   **UI/UX 调整**: 修改了组件样式、布局和色彩系统，使其更符合我的个人偏好。
-   **功能增强**: 扩展了原有功能，例如集成了多种评论系统、增加了新的侧边栏小部件等。
-   **代码重构**: 优化了部分内部逻辑，并调整了项目结构以方便长期维护。

## 快速开始

如果你希望在本地运行或了解本项目，请确保具备基础的前端知识，并建议先行阅读 [VitePress 官方文档](https://vitepress.dev/zh/guide/what-is-vitepress)。

### 1. 本地开发

```bash
# 克隆仓库
git clone https://github.com/5um3rM0/5um3rM0.github.io.git

# 进入项目目录
cd 5um3rM0.github.io

# 安装依赖 (推荐使用 npm)
npm install

# 启动本地开发服务器
npm run dev
```

服务启动后，默认访问地址为 `http://localhost:9877`。

### 2. 内容发布

-   **撰写文章**: 在 `posts/` 目录下新建 Markdown 文件即可。推荐按 `posts/年份/编号.md` 格式组织。
-   **创建页面**: 在 `pages/` 目录下新建 Markdown 文件可创建新的独立页面。
-   **Frontmatter**: 每篇文章的元数据（如标题、日期、标签）都定义在文件顶部的 `frontmatter` 中，这是所有自动化功能的数据来源。

### 3. 主题配置

主要的个性化配置位于项目根目录的 `themeConfig.mjs` 文件中。在此文件中的修改会覆盖主题的默认配置。

### 4. 静态资源

图片、字体等静态资源存放于根目录的 `public/` 文件夹中。

### 5. 构建与部署

```bash
# 构建生产版本的静态文件
npm run build
```

构建产物将生成在 `.vitepress/dist` 目录中。

本项目的部署流程已通过 GitHub Actions 完全自动化。任何推送到 `main` 分支的提交都会自动触发构建和部署流程，将最新内容发布到 GitHub Pages。

## 致谢 (Acknowledgements)

本博客的美学和功能基础源于 [imsyy](https://github.com/imsyy) 的杰出开源项目 [vitepress-theme-curve](https://github.com/imsyy/vitepress-theme-curve)。

由衷感谢原作者的分享与贡献，它为本项目提供了一个优秀的起点。

## 许可 (License)

本项目采用 [MIT License](./LICENSE) 开源许可证。