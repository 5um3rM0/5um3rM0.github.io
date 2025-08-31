import { generateId } from "./commonTools.mjs";
import { globby } from "globby";
import matter from "gray-matter";
import fs from "fs-extra";

/**
 * 获取 posts 目录下所有 Markdown 文件的路径
 * @returns {Promise<string[]>} - 文件路径数组
 */
const getPostMDFilePaths = async () => {
  try {
    let paths = await globby(["**.md"], {
      ignore: ["node_modules", "pages", ".vitepress", "README.md"],
    });
    return paths.filter((item) => item.includes("posts/"));
  } catch (error) {
    console.error("获取文章路径时出错:", error);
    throw error;
  }
};

/**
 * 基于 frontMatter 日期降序排序文章
 * @param {Object} obj1 - 第一篇文章对象
 * @param {Object} obj2 - 第二篇文章对象
 * @returns {number} - 比较结果
 */
const compareDate = (obj1, obj2) => {
  return obj1.date < obj2.date ? 1 : -1;
};
const comparePostPriority = (a, b) => {
  if (a.top && !b.top) {
    return -1;
  }
  if (!a.top && b.top) {
    return 1;
  }
  return compareDate(a, b);
};

/**
 * 获取所有文章，读取其内容并解析 front matter
 * @returns {Promise<Object[]>} - 文章对象数组
 */
export const getAllPosts = async () => {
  try {
    const paths = await getPostMDFilePaths();
    const posts = await Promise.all(
      paths.map(async (item) => {
        try {
          const fileContent = await fs.readFile(item, "utf-8");
          const { data, content } = matter(fileContent);

          if (data.hidden === true) {
            return null;
          }
          
          const stat = await fs.stat(item);
          const { birthtimeMs, mtimeMs } = stat;
          const { title, date, categories, description, tags, top } = data;
          const wordCount = content.replace(/---[\s\S]*?---/, '').replace(/[#*`_~>\-[\]()|]/g, '').replace(/\s/g, '').length;
          const expired = Math.floor(
            (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
          );
          return {
            id: generateId(item),
            title: title || "未命名文章",
            date: date ? new Date(date).getTime() : birthtimeMs,
            lastModified: mtimeMs,
            expired,
            tags,
            categories,
            description,
            regularPath: `/${item.replace(".md", ".html")}`,
            top,
            wordCount,
          };
        } catch (error) {
          console.error(`处理文章文件 '${item}' 时出错:`, error);
          return null;
        }
      }),
    );
    
    const visiblePosts = posts.filter(Boolean);

    visiblePosts.sort(comparePostPriority);
    return visiblePosts;
  } catch (error) {
    console.error("获取所有文章时出错:", error);
    throw error;
  }
};

/**
 * 获取所有标签及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含标签统计信息的对象
 */
export const getAllType = (postData) => {
  const tagData = {};
  postData.map((item) => {
    if (!item.tags || item.tags.length === 0) return;
    if (typeof item.tags === "string") {
      item.tags = item.tags.split(",");
    }
    item.tags.forEach((tag) => {
      if (!tagData[tag]) {
        tagData[tag] = { count: 1, articles: [item] };
      } else {
        tagData[tag].count++;
        tagData[tag].articles.push(item);
      }
    });
  });
  return tagData;
};

/**
 * 获取所有分类及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含标签统计信息的对象
 */
export const getAllCategories = (postData) => {
  const catData = {};
  postData.map((item) => {
    if (!item.categories || item.categories.length === 0) return;
    if (typeof item.categories === "string") {
      item.categories = item.categories.split(",");
    }
    item.categories.forEach((tag) => {
      if (!catData[tag]) {
        catData[tag] = { count: 1, articles: [item] };
      } else {
        catData[tag].count++;
        catData[tag].articles.push(item);
      }
    });
  });
  return catData;
};

/**
 * 获取所有年份及其相关文章的统计信息
 * @param {Object[]} postData - 包含文章信息的数组
 * @returns {Object} - 包含归档统计信息的对象
 */
export const getAllArchives = (postData) => {
  const archiveData = {};
  postData.forEach((item) => {
    if (item.date) {
      const date = new Date(item.date);
      const year = date.getFullYear().toString();
      if (!archiveData[year]) {
        archiveData[year] = { count: 1, articles: [item] };
      } else {
        archiveData[year].count++;
        archiveData[year].articles.push(item);
      }
    }
  });
  const sortedYears = Object.keys(archiveData).sort((a, b) => parseInt(b) - parseInt(a));
  return { data: archiveData, year: sortedYears };
};