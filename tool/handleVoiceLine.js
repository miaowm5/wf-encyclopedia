const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");

/**
 * 获取 MP3 标签（如 title, artist, album 等）
 * @param {string} ffprobePath - ffprobe 的路径
 * @param {string} filePath - mp3 文件路径
 * @param {string} tagName - 标签名，例如 "title" / "artist" / "album"
 * @returns {Promise<string|null>} 标签内容，或 null
 */
function getMp3Tag(ffprobePath, filePath, tagName = "title") {
  return new Promise((resolve, reject) => {
    execFile(
      ffprobePath,
      [
        "-v", "error",
        "-show_entries", `format_tags=${tagName}`,
        "-of", "default=noprint_wrappers=1:nokey=1",
        filePath
      ],
      { encoding: "buffer" }, // 以 buffer 获取原始数据，避免乱码
      (err, stdout) => {
        if (err) return reject(err);

        // 默认用 UTF-8 解析，如果发现乱码可以配合 iconv-lite 解码
        const text = stdout.toString("utf8").trim();
        resolve(text || null);
      }
    );
  });
}

const outputDir = path.join(__dirname, 'output');
const voiceDir = path.join(outputDir, 'voice');
const packDir = path.join(outputDir, 'pack');
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
    console.log(`Processing ${item.out}...`)
    config[item.out] = {}
    for (const file of item.inputs){
      const key = file
        .slice(path.join(voiceDir, item.out).length + 1, file.length - 4)
        .replace(/\\/g, "/")
      if (key.startsWith('ally/')){ continue }
      if (key.startsWith('home/')){ continue }
      try{
        const tag = await getMp3Tag("./ffprobe.exe", file, "title")
        config[item.out][key] = tag
      }catch(e){
        console.error("Unable to probe title: " + file)
      }
    }
  }
  fs.writeFileSync(path.join(packDir, 'voiceLine.json'), JSON.stringify(config, null, 2), 'utf8');
}

packVoice();
