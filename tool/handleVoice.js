const path = require("path");
const fs = require("fs");
const { makeAudiosprite } = require("./audiosprite");

const outputDir = path.join(__dirname, 'output', 'pack');
const voiceDir = path.join(__dirname, 'output', 'voice');
const packDir = path.join(outputDir, 'voice');
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
  const config2 = {}
  for (const item of taskQueue){
    const normalAudio = []
    const wordAudio = []
    const simpleKey = (file)=>{
      return file
        .slice(path.join(voiceDir, item.out).length + 1, file.length - 4)
        .replace(/\\/g, "/")
    }
    item.inputs.forEach((file)=>{
      const key = simpleKey(file)
      if (key.startsWith('ally/')){ normalAudio.push(file); return }
      if (key.startsWith('home/')){ normalAudio.push(file); return }
      if (key.startsWith('battle/')){ normalAudio.push(file); return }
      wordAudio.push(file)
    })
    if (normalAudio.length > 0){
      const { audioFile, map } = await makeAudiosprite({
        inputs: normalAudio,
        ffmpeg: "./ffmpeg.exe",
        ffprobe: "./ffprobe.exe",
        out: path.join(packDir, item.out),
      });
      console.log("输出文件:", audioFile);
      config[item.out] = {};
      Object.keys(map).forEach((key)=>{ config[item.out][simpleKey(key)] = map[key] })
    }
    if (wordAudio.length > 0){
      const { audioFile, map } = await makeAudiosprite({
        inputs: wordAudio,
        ffmpeg: "./ffmpeg.exe",
        ffprobe: "./ffprobe.exe",
        out: path.join(packDir, `${item.out}-word`),
      });
      console.log("输出文件:", audioFile);
      config2[item.out] = {};
      Object.keys(map).forEach((key)=>{ config2[item.out][simpleKey(key)] = map[key] })
    }
  }
  config.timestamp = Date.now();
  config2.timestamp = Date.now();
  fs.writeFileSync(path.join(outputDir, 'voice.json'), JSON.stringify(config), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'voice-word.json'), JSON.stringify(config2), 'utf8');
}

packVoice();
