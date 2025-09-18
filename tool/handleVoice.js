const path = require("path");
const fs = require("fs");
const { makeAudiosprite } = require("./audiosprite");

const outputDir = path.join(__dirname, 'output');
const voiceDir = path.join(outputDir, 'voice');
const packDir = path.join(outputDir, 'pack/voice');
if (!fs.existsSync(packDir)) fs.mkdirSync(packDir, { recursive: true });

function findAudioFiles(dir, result = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  items.forEach(item => {
    const itemPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      // 如果是目录，递归查找
      findAudioFiles(itemPath, result);
    } else if (item.isFile() && (item.name.endsWith('.mp3') || item.name.endsWith('.wav') || item.name.endsWith('.ogg'))) {
      result.push(itemPath);
    }
  });
  return result;
}

async function packVoice(){
  const taskQueue = [];
  fs.readdirSync(voiceDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .forEach(subDir => {
      const subDirPath = path.join(voiceDir, subDir);
      const file = findAudioFiles(subDirPath)
      if (file.length > 0) {
        taskQueue.push({ inputs: file, out: subDir, })
      }
    });
  const config = {}
  for (const item of taskQueue){
    const { audioFile, map } = await makeAudiosprite({
      inputs: item.inputs,
      ffmpeg: "./ffmpeg.exe",
      ffprobe: "./ffprobe.exe",
      out: path.join(packDir, item.out),
      gap: 1,
    });
    let simpleMap = {}
    Object.keys(map).forEach((key)=>{
      const simpleKey = key
        .slice(path.join(voiceDir, item.out).length + 1, key.length)
        .replace(/\\/g, "/")
      simpleMap[simpleKey] = map[key]
    })
    config[item.out] = simpleMap;
    console.log("输出文件:", audioFile);
  }
  config.timestamp = Date.now()
  fs.writeFileSync(path.join(outputDir, 'pack/voice.json'), JSON.stringify(config), 'utf8');
}

packVoice();
