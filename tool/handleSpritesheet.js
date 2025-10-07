// 打包图集

const fs = require('fs');
const path = require('path');
const texturePacker = require("free-tex-packer-core");

const storyDir = path.join(__dirname, 'output', 'story');
const headDir = path.join(__dirname, 'output', 'head');
const pixelDir = path.join(__dirname, 'output', 'pixel');
const uiDir = path.join(__dirname, 'output', 'ui');
const packDir = path.join(__dirname, 'output', 'pack');
const metaDataPath = path.join(__dirname, 'orderedmap/generated', 'trimmed_image.json');
const metaDataPath2 = path.join(__dirname, 'orderedmap/generated', 'trimmed_image_iosbundled.json');

// 创建输出目录（如果不存在）
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir(packDir);
ensureDir(path.join(packDir, 'story'));
ensureDir(path.join(packDir, 'head'));
ensureDir(path.join(packDir, 'ui'));
ensureDir(path.join(packDir, 'pixel_special'));
ensureDir(path.join(packDir, 'pixel_normal'));

const packOtions = {
  textureName: "my-texture",
  width: 1280,
  height: 1280,
  padding: 1,
  allowRotation: true,
  detectIdentical: true,
  allowTrim: true,
  removeFileExtension: true,
  exporter: {
    fileExt: "json",
    template: "./spritesheet.mst"
  },
}

/**
 * 通用打包函数
 * @param {Array} images 图片对象数组 [{path, contents}]
 * @param {String} textureName 图集名称
 * @param {String} outDir 输出目录
 * @param {Function} metaProcess 元数据处理函数（可选）
 * @param {Object} option 额外打包选项（可选）
 */
async function packImages(imagePaths, textureName, outDir, metaProcess, option={}) {
  let spritesheetData = {};
  try {
    // 按需读取图片内容，避免一次性全部加载
    const images = imagePaths.map(img => ({
      path: img.virtualPath,
      contents: fs.readFileSync(img.realPath)
    }));
    const files = await texturePacker.packAsync(images, { ...packOtions, textureName, ...option });
    for (let item of files) {
      if (item.name.endsWith('.json')) {
        const jsonStr = item.buffer.toString('utf8');
        const jsonObj = JSON.parse(jsonStr);
        spritesheetData = { ...spritesheetData, ...jsonObj };
      } else {
        fs.writeFileSync(path.join(outDir, item.name), item.buffer);
        console.log('已保存:', item.name);
      }
    }
    Object.keys(spritesheetData).forEach((key) => {
      if (!spritesheetData[key].rotated){
        spritesheetData[key].rotated = undefined
      }
    })
    if (metaProcess) metaProcess(spritesheetData);
    spritesheetData.timestamp = Date.now();
    return spritesheetData
  } catch (e) {
    console.error('Packaging failed', e);
  }
}

// 打包 story 图集
async function packStory() {
  const metaImageData = {
    ...JSON.parse(fs.readFileSync(metaDataPath).toString()),
    ...JSON.parse(fs.readFileSync(metaDataPath2).toString())
  }
  const taskQueue = [];

  // 遍历 story 子目录
  fs.readdirSync(storyDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .forEach(subDir => {
      const subDirPath = path.join(storyDir, subDir);
      const pngFiles = fs.readdirSync(subDirPath).filter(file => file.endsWith('.png'));
      if (pngFiles.length > 0) {
        const imagePaths = pngFiles.map(file => ({
          virtualPath: `character/${subDir}/ui/story/${file}`,
          realPath: path.join(subDirPath, file)
        }));
        taskQueue.push({ subDir, imagePaths });
      }
    });

  let spritesheetData = {}
  for (const item of taskQueue) {
    const json = await packImages(
      item.imagePaths,
      item.subDir,
      path.join(packDir, 'story'),
      (spritesheetData) => {
        Object.keys(spritesheetData).forEach((key) => {
          const metaData = metaImageData[key];
          if (!metaData) {
            console.log(`metadatamissing: ${key}`);
            return;
          }
          spritesheetData[key].spriteSourceSize.x += metaData[0] - 0;
          spritesheetData[key].spriteSourceSize.y += metaData[1] - 0;
          spritesheetData[key].sourceSize.w = metaData[2] - 0;
          spritesheetData[key].sourceSize.h = metaData[3] - 0;
        });
      },
      { width: 2048, height: 2048 }
    );
    spritesheetData = { ...spritesheetData, ...json };
  }
  fs.writeFileSync(path.join(packDir, 'story.json'), JSON.stringify(spritesheetData));
}

// 打包 head 图集
async function packHead() {
  const pngFiles = fs.readdirSync(headDir).filter(file => file.endsWith('.png'));
  if (pngFiles.length === 0) return;
  const imagePaths = pngFiles.map(file => ({
    virtualPath: `${file}`,
    realPath: path.join(headDir, file)
  }));
  let spritesheetData = await packImages(
    imagePaths,
    'head',
    path.join(packDir, 'head'),
  );
  fs.writeFileSync(path.join(packDir, 'head.json'), JSON.stringify(spritesheetData));
}

// 打包 pixel 图集
async function packPixel() {
  const packSpritesheet = async (prefix)=>{
    const specialDir = path.join(pixelDir, prefix)
    const pngFiles = fs.readdirSync(specialDir).filter(file => file.endsWith('.png'));
    if (pngFiles.length === 0) return;
    const imagePaths = pngFiles.map(file => ({
      virtualPath: `${file}`,
      realPath: path.join(specialDir, file)
    }));
    let spritesheetData = await packImages(
      imagePaths,
      `pixel_${prefix}`,
      path.join(packDir, `pixel_${prefix}`),
    );
    fs.writeFileSync(path.join(packDir, `pixel_${prefix}.json`), JSON.stringify(spritesheetData));
  }
  await packSpritesheet('normal')
  await packSpritesheet('special')
  let result ={}

  const specialDir = path.join(pixelDir, 'special')
  const jsonFiles = fs.readdirSync(specialDir).filter(file => file.endsWith('.json'));
  jsonFiles.forEach((file)=>{
    let data = JSON.parse(fs.readFileSync(path.join(specialDir, file)).toString())
    data.forEach(item=>{
      item.n = item.n.slice(item.n.length - 4, item.n.length) - 0
      item.fw = undefined
      item.fh = undefined
    })
    result[file.slice(0, file.length - 5)] = {
      special: data
    }
  })
  const normalDir = path.join(pixelDir, 'normal')
  const jsonFiles2 = fs.readdirSync(normalDir).filter(file => file.endsWith('.json'));
  jsonFiles2.forEach((file)=>{
    let data = JSON.parse(fs.readFileSync(path.join(normalDir, file)).toString())
    if (file.endsWith('timeline.json')){
      data = data.sequences
      data.forEach((action)=>{ action.kind = undefined })
      let id = file.slice(0, file.length - 14)
      result[id] = result[id] || {}
      result[id].timeline = data
    }else{
      data.forEach(item=>{
        item.n = item.n.slice(item.n.length - 4, item.n.length) - 0
        item.fw = undefined
        item.fh = undefined
      })
      let id = file.slice(0, file.length - 5)
      result[id] = result[id] || {}
      result[id].normal = data
    }
  })
  fs.writeFileSync(path.join(packDir, 'pixel.json'), JSON.stringify(result));
}

// 打包 ui 图集
async function packUI() {
  const subUIDir = fs.readdirSync(uiDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (let subDirName of subUIDir) {
    const packResDir = path.join(packDir, 'ui', subDirName);
    ensureDir(packResDir);
    const rootDir = path.join(uiDir, subDirName);
    const pngFiles = fs.readdirSync(rootDir).filter(file => file.endsWith('.png'));
    if (pngFiles.length === 0) continue;
    const imagePaths = pngFiles.map(file => ({
      virtualPath: `${file}`,
      realPath: path.join(rootDir, file)
    }));
    let spritesheetData = await packImages(
      imagePaths,
      subDirName,
      packResDir,
    );
    fs.writeFileSync(path.join(packDir, 'ui', `${subDirName}.json`), JSON.stringify(spritesheetData));
  }
}

const main = async ()=>{
  await packStory()
  await packHead()
  await packPixel()
  await packUI()
}

main()
