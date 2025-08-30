import fs from 'fs';
import path from 'path';

const selfieDir = path.join(process.cwd(), 'public', 'images', 'about');
const outputFile = path.join(process.cwd(), 'public', 'selfie-list.json');

try {
  const files = fs.readdirSync(selfieDir);
  const imageFiles = files
    .filter(file => /\.(png|jpe?g|webp|gif)$/i.test(file))
    .map(file => `/images/about/${file}`);

  fs.writeFileSync(outputFile, JSON.stringify(imageFiles, null, 2));
  console.log(`✅ 成功生成 selfie-list.json, 包含 ${imageFiles.length} 张图片。`);
} catch (error) {
  console.error("❌ 生成自拍列表失败:", error);
  fs.writeFileSync(outputFile, '[]'); // 创建空列表以防构建失败
}