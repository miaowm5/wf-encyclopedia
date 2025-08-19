// 读取 input 文件夹中的所有json文件
// 取出每个 json 文件中的 frames 字段，将 meta 字段的 image 属性添加到每个 frames 下的对象中
// 删除 frames 下每个对象的 rotated trimmed pivot 字段以及 spriteSourceSize 字段下的 h w 字段
// 将处理后的每个 frame 合并为一个新的对象
// 最后将处理后的数据写入到 output.json 文件中

const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'input');
const outputPath = path.join(__dirname, 'output.json');

let mergedFrames = {};

fs.readdirSync(inputDir).forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(inputDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const { frames, meta } = data;

    Object.entries(frames).forEach(([key, frameObj]) => {
      // 添加 image 字段
      frameObj.image = meta.image;

      // 删除指定字段
      delete frameObj.rotated;
      delete frameObj.trimmed;
      delete frameObj.pivot;

      if (frameObj.spriteSourceSize) {
        delete frameObj.spriteSourceSize.h;
        delete frameObj.spriteSourceSize.w;
      }

      mergedFrames[key] = frameObj;
    });
  }
});

// 写入 output.json
fs.writeFileSync(outputPath, JSON.stringify(mergedFrames, null, 0), 'utf-8');
console.log('处理完成，结果已写入 output.json');
