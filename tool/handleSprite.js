// 使用nodejs进行文件的处理：
// 1. 读取 character 目录下的子目录，若该子目录的子目录下不包含UI文件，则跳过处理
// 2. 对于包含UI文件的子目录，若包含 square_0.png，则将其复制到 output/head 目录下，文件名为 原始目录名.png
// 3. 对于包含UI文件的子目录，若包含 episode_banner_0.png，则将其复制到 output/banner 目录下，文件名为 原始目录名.png

const fs = require('fs');
const path = require('path');

// 目录路径
const characterDir = path.join(__dirname, 'character');
const outputHeadDir = path.join(__dirname, 'output', 'head');
const outputBannerDir = path.join(__dirname, 'output', 'banner');

// 创建输出目录（如果不存在）
fs.mkdirSync(outputHeadDir, { recursive: true });
fs.mkdirSync(outputBannerDir, { recursive: true });

// 读取 character 目录下的所有子目录
fs.readdirSync(characterDir, { withFileTypes: true }).forEach(dirent => {
    if (!dirent.isDirectory()) return;
    const subDirName = dirent.name;
    const subDirPath = path.join(characterDir, subDirName);

    // 查找子目录下的所有子目录
    fs.readdirSync(subDirPath, { withFileTypes: true }).forEach(subDirent => {
        if (!subDirent.isDirectory()) return;
        const uiDirPath = path.join(subDirPath, subDirent.name);

        // 检查是否包含UI文件
        const files = fs.readdirSync(uiDirPath);
        const hasSquare = files.includes('square_0.png');
        const hasBanner = files.includes('episode_banner_0.png');
        if (!hasSquare && !hasBanner) return; // 没有需要的UI文件则跳过

        // 复制 square_0.png
        if (hasSquare) {
            const src = path.join(uiDirPath, 'square_0.png');
            const dest = path.join(outputHeadDir, `${subDirName}.png`);
            fs.copyFileSync(src, dest);
        }

        // 复制 episode_banner_0.png
        if (hasBanner) {
            const src = path.join(uiDirPath, 'episode_banner_0.png');
            const dest = path.join(outputBannerDir, `${subDirName}.png`);
            fs.copyFileSync(src, dest);
        }
    });
});
