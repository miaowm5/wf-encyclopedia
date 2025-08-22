// 打包图集

const fs = require('fs');
const path = require('path');
const texturePacker = require("free-tex-packer-core");

const storyDir = path.join(__dirname, 'output', 'story');
const headDir = path.join(__dirname, 'output', 'head');
const packDir = path.join(__dirname, 'output/pack');
const metaDataPath = path.join(__dirname, 'orderedmap/generated', 'trimmed_image.json');
const metaDataPath2 = path.join(__dirname, 'orderedmap/generated', 'trimmed_image_iosbundled.json');

// 创建输出目录（如果不存在）
if (!fs.existsSync(packDir)) fs.mkdirSync(packDir, { recursive: true });
if (!fs.existsSync(path.join(packDir, 'story'))) fs.mkdirSync(path.join(packDir, 'story'), { recursive: true });
if (!fs.existsSync(path.join(packDir, 'head'))) fs.mkdirSync(path.join(packDir, 'head'), { recursive: true });

const packOtions = {
  textureName: "my-texture",
  width: 1280,
  height: 1280,
  padding: 1,
  allowRotation: false,
  detectIdentical: true,
  allowTrim: false,
  removeFileExtension: true,
  exporter: {
    fileExt: "json",
    template: "./spritesheet.mst"
  },
}

const packStory = async ()=>{
  let spritesheetData = {}
  const taskQueue = []

  fs.readdirSync(storyDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .forEach(subDir => {
      const subDirPath = path.join(storyDir, subDir);
      const pngFiles = fs.readdirSync(subDirPath)
        .filter(file => file.endsWith('.png'));
      if (pngFiles.length > 0) {
        let images = [];
        pngFiles.forEach(file => {
          images.push({path: `character/${subDir}/ui/story/${file}`, contents: path.join(subDirPath, file)});
        });
        taskQueue.push({ subDir, images })
      }
    });

  for (const item of taskQueue){
    const images = item.images.map((img)=>{
      return {path: img.path, contents: fs.readFileSync(img.contents) }
    })
    try{
      const files =await texturePacker.packAsync(images, {...packOtions, textureName: item.subDir})
      for(let item of files){
        if (item.name.endsWith('.json')){
          const jsonStr = item.buffer.toString('utf8');
          const jsonObj = JSON.parse(jsonStr);
          spritesheetData = { ...spritesheetData, ...jsonObj }
        }else{
          fs.writeFileSync(path.join(packDir, 'story', item.name), item.buffer);
          console.log('已保存:', item.name);
        }
      }
    }catch(e){
      console.error('Packaging failed', e);
    }
  }

  const metaImageData = JSON.parse(fs.readFileSync(metaDataPath).toString())
  const metaImageData2 = JSON.parse(fs.readFileSync(metaDataPath2).toString())
  Object.keys(spritesheetData).forEach((key)=>{
    const metaData = metaImageData[key]?.[0] || metaImageData2[key]
    if (!metaData){
      console.log(`metadatamissing: ${key}`);
      return
    }
    spritesheetData[key].spriteSourceSize.x += metaData[0] - 0
    spritesheetData[key].spriteSourceSize.y += metaData[1] - 0
    spritesheetData[key].sourceSize.w = metaData[2] - 0
    spritesheetData[key].sourceSize.h = metaData[3] - 0
  });
  spritesheetData.timestamp = Date.now();
  fs.readFileSync(metaDataPath2).toString()

  fs.writeFileSync(path.join(packDir, 'story.json'), JSON.stringify(spritesheetData));
}

const packHead = async ()=>{
  let spritesheetData = {}
  const images = [];
  const pngFiles = fs.readdirSync(headDir).filter(file => file.endsWith('.png'));
  if (pngFiles.length === 0) { return }
  pngFiles.forEach(file => {
    images.push({path: `${file}`, contents: fs.readFileSync(path.join(headDir, file)) });
  });
  try{
    const files =await texturePacker.packAsync(images, {...packOtions, textureName: 'head'})
    for(let item of files){
      if (item.name.endsWith('.json')){
        const jsonStr = item.buffer.toString('utf8');
        const jsonObj = JSON.parse(jsonStr);
        spritesheetData = { ...spritesheetData, ...jsonObj }
      }else{
        fs.writeFileSync(path.join(packDir, 'head', item.name), item.buffer);
        console.log('已保存:', item.name);
      }
    }
  }catch(e){
    console.error('Packaging failed', e);
  }
  spritesheetData.timestamp = Date.now();
  fs.writeFileSync(path.join(packDir, 'head.json'), JSON.stringify(spritesheetData));
}

const main = async ()=>{
  await packStory()
  await packHead()
}

main()
