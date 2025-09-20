/**
 * audiosprite.js
 *
 * Node.js 模块
 * 用 ffmpeg / ffprobe (自定义路径) 生成 audiosprite
 * 默认输出 OGG (Vorbis)
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const os = require("os");

// 内部工具
function runSync(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  if (res.error) throw res.error;
  if (res.status !== 0) {
    const msg = `Command failed: ${cmd} ${args.join(" ")}\nexitCode=${res.status}\nstdout:\n${res.stdout}\nstderr:\n${res.stderr}`;
    throw new Error(msg);
  }
  return res.stdout || res.stderr || "";
}

function probeDuration(ffprobePath, ffmpegPath, file) {
  try {
    const out = runSync(ffprobePath, [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      file,
    ]);
    const n = parseFloat(out.trim());
    if (Number.isFinite(n)) return n;
    // console.log(out)
  } catch {
    // fallback: ffmpeg -i
    const out = spawnSync(ffmpegPath, ["-i", file], {
      encoding: "utf8",
      stderr: "pipe",
      stdout: "pipe",
    });
    const txt = out.stderr || out.stdout || "";
    const m = txt.match(/Duration:\s*([0-9:.]+)/);
    if (m) {
      const parts = m[1].split(":").map(parseFloat);
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    // console.log(txt)
  }
  console.error("Unable to probe duration: " + file)
  throw new Error("Unable to probe duration: " + file);
}

async function makeTempDir(prefix = "audiosprite-") {
  return fsp.mkdtemp(path.join(os.tmpdir(), prefix));
}

/**
 * makeAudiosprite
 *
 * @param {Object} options
 * @param {string[]} options.inputs - 输入音频文件数组
 * @param {string} [options.ffmpeg="ffmpeg"] - ffmpeg 路径
 * @param {string} [options.ffprobe="ffprobe"] - ffprobe 路径
 * @param {string} [options.out="sprite"] - 输出文件前缀
 *
 * @returns {Promise<{ audioFile: string, jsonFile: string, map: any }>}
 */
async function makeAudiosprite({
  inputs,
  ffmpeg = "ffmpeg",
  ffprobe = "ffprobe",
  out = "sprite",
} = {}) {
  if (!inputs || !inputs.length) {
    throw new Error("No input files provided.");
  }

  runSync(ffmpeg, ["-version"]); // 确认 ffmpeg 可用
  let haveFFprobe = true;
  try {
    runSync(ffprobe, ["-version"]);
  } catch {
    haveFFprobe = false;
  }

  let absInputs = inputs.map((p) => path.resolve(p));
  for (const f of absInputs) {
    if (!fs.existsSync(f)) throw new Error("Input not found: " + f);
  }

  const tmp = await makeTempDir();
  let durations = absInputs.map((f) =>{
    try{
      return probeDuration(haveFFprobe ? ffprobe : ffmpeg, ffmpeg, f)
    }catch(e){
      return 0
    }
  });
  absInputs = absInputs.filter((f, i) => durations[i] > 0);
  durations = durations.filter((d) => d > 0);

  const tmpInputs = [];
  for (let i = 0; i < absInputs.length; i++) {
    const src = absInputs[i];
    const dst = path.join(tmp, `input_${i}.wav`);
    runSync(ffmpeg, [
      '-y',
      '-i', src,
      '-ar', '44100', // 采样率
      '-ac', '2',     // 双声道
      '-f', 'wav',
      dst
    ]);
    tmpInputs.push(dst);
  }

  // 生成 1 秒静音 wav 文件
  const silencePath = path.join(tmp, "silence.wav");
  runSync(ffmpeg, [
    '-y',
    '-f', 'lavfi',
    '-i', 'anullsrc=r=44100:cl=stereo',
    '-t', '1',
    '-ar', '44100',
    '-ac', '2',
    '-f', 'wav',
    silencePath
  ]);

  // 生成 concat 文件列表，插入静音
  const concatListPath = path.join(tmp, "inputs.txt");
  const concatFiles = [];
  for (let i = 0; i < tmpInputs.length; i++) {
    concatFiles.push(`file '${tmpInputs[i].replace(/'/g, "'\\''")}'`);
    if (i < tmpInputs.length - 1) {
      concatFiles.push(`file '${silencePath.replace(/'/g, "'\\''")}'`);
    }
  }
  fs.writeFileSync(concatListPath, concatFiles.join("\n"), "utf8");

  const outFile = path.resolve(`${out}.ogg`);

  // 合并音频，避免 ENAMETOOLONG
  runSync(ffmpeg, [
    "-f", "concat",
    "-safe", "0",
    "-i", concatListPath,
    "-acodec", "libvorbis",
    outFile
  ]);

  // build JSON map
  let cursor = 0;
  const spritemap = {};
  absInputs.forEach((f, i) => {
    spritemap[f] = [
      Number((cursor * 1000).toFixed()),
      Number((durations[i] * 1000).toFixed()),
    ]
    cursor += durations[i];
    cursor += 1;
  });
  return { audioFile: outFile, map: spritemap };
}

// 导出模块
module.exports = { makeAudiosprite };
