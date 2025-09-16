// 1. 读取 assets/character 目录下的子目录
// 2. 对于包含ui目录的子目录，若包含 square_0.png，则将其复制到 output/head 目录下，文件名为 原始目录名.png
// 3. 对于包含ui目录的子目录，若包含 full_shot_1440_1920_0.png，则将其复制到 output/full_shot 目录下，文件名为 原始目录名_0.png
// 4. 对于包含ui目录的子目录，若包含 full_shot_1440_1920_1.png，则将其复制到 output/full_shot 目录下，文件名为 原始目录名_1.png
// 5. 对于包含ui目录的子目录，若包含 story 目录，则将该目录及目录下全部文件复制到 output/story 目录下，复制后的目录名为 子目录名
// 6. 对于包含voice目录的子目录，将该目录及目录下全部文件复制到 output/voice 目录下，复制后的目录名为 子目录名

const fs = require('fs');
const path = require('path');

const characterDir = path.join(__dirname, 'assets', 'character');
const outputHeadDir = path.join(__dirname, 'output', 'head');
const outputFullShotDir = path.join(__dirname, 'output', 'full_shot');
const outputStoryDir = path.join(__dirname, 'output', 'story');
const outputVoiceDir = path.join(__dirname, 'output', 'voice');

// 创建输出目录（如果不存在）
if (!fs.existsSync(outputHeadDir)) fs.mkdirSync(outputHeadDir, { recursive: true });
if (!fs.existsSync(outputFullShotDir)) fs.mkdirSync(outputFullShotDir, { recursive: true });
if (!fs.existsSync(outputStoryDir)) fs.mkdirSync(outputStoryDir, { recursive: true });
if (!fs.existsSync(outputVoiceDir)) fs.mkdirSync(outputStoryDir, { recursive: true });

fs.readdirSync(characterDir, { withFileTypes: true }).forEach(dirent => {
  if (!dirent.isDirectory()) return;
  const subDirName = dirent.name;
  const subDirPath = path.join(characterDir, subDirName);
  const uiDirPath = path.join(subDirPath, 'ui');
  const voiceDirPath = path.join(subDirPath, 'voice');

  if (fs.existsSync(uiDirPath) && fs.statSync(uiDirPath).isDirectory()){
    // 处理 square_0.png
    const squarePngPath = path.join(uiDirPath, 'square_0.png');
    if (fs.existsSync(squarePngPath)) {
      const destPngPath = path.join(outputHeadDir, `${subDirName}.png`);
      fs.copyFileSync(squarePngPath, destPngPath);
      console.log(`已复制: ${squarePngPath} -> ${destPngPath}`);
    }

    // 处理 full_shot_1440_1920_0.png
    const fullShot0Path = path.join(uiDirPath, 'full_shot_1440_1920_0.png');
    if (fs.existsSync(fullShot0Path)) {
      const destFullShot0Path = path.join(outputFullShotDir, `${subDirName}_0.png`);
      fs.copyFileSync(fullShot0Path, destFullShot0Path);
      console.log(`已复制: ${fullShot0Path} -> ${destFullShot0Path}`);
    }

    // 处理 full_shot_1440_1920_1.png
    const fullShot1Path = path.join(uiDirPath, 'full_shot_1440_1920_1.png');
    if (fs.existsSync(fullShot1Path)) {
      const destFullShot1Path = path.join(outputFullShotDir, `${subDirName}_1.png`);
      fs.copyFileSync(fullShot1Path, destFullShot1Path);
      console.log(`已复制: ${fullShot1Path} -> ${destFullShot1Path}`);
    }

    // 处理 story 目录
    const storyDirPath = path.join(uiDirPath, 'story');
    if (fs.existsSync(storyDirPath) && fs.statSync(storyDirPath).isDirectory()) {
      const destStoryPath = path.join(outputStoryDir, subDirName);
      copyDir(storyDirPath, destStoryPath);
      console.log(`已复制: ${storyDirPath} -> ${destStoryPath}`);
    }
  }

  // 处理 voice 目录
  if (fs.existsSync(voiceDirPath) && fs.statSync(voiceDirPath).isDirectory()) {
    const destStoryPath = path.join(outputVoiceDir, subDirName);
    copyDir(voiceDirPath, destStoryPath);
    console.log(`已复制: ${voiceDirPath} -> ${destStoryPath}`);
  }
});

// 递归复制目录
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true }).forEach(dirent => {
    const srcPath = path.join(src, dirent.name);
    const destPath = path.join(dest, dirent.name);
    if (dirent.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}
