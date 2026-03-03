import fs from 'fs'
import path from 'path'
import CRC32 from 'crc-32'

/**
 * 计算单个文件的 CRC32 (使用 Stream 降低内存占用)
 */
function getFileCRC32(filePath) {
  return new Promise((resolve, reject) => {
    let crc = 0;
    const stream = fs.createReadStream(filePath);

    stream.on('data', (chunk) => {
      crc = CRC32.buf(chunk, crc);
    });

    stream.on('end', () => {
      // 转换为 8 位十六进制字符串
      resolve((crc >>> 0).toString(16).padStart(8, '0'));
    });

    stream.on('error', reject);
  });
}

const IGNORE_LIST = ['.git', '_headers', 'readme.md'];

/**
 * 递归遍历文件夹并计算所有文件的 CRC32
 */
async function calculateFolderCRC32(dirPath, baseDir = dirPath) {
  const results = {};
  const files = fs.readdirSync(dirPath).filter(item=>!IGNORE_LIST.includes(item.toLowerCase()));
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      const subFolderResults = await calculateFolderCRC32(fullPath, baseDir);
      Object.assign(results, subFolderResults);
    } else {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      console.log(`handle: ${relativePath}`)
      results[relativePath] = await getFileCRC32(fullPath);
    }
  }
  return results;
}

async function saveSortedManifest(dirPath, outputPath) {
  const rawResults = await calculateFolderCRC32(dirPath);
  const sortedKeys = Object.keys(rawResults).sort();
  const sortedManifest = {};
  for (const key of sortedKeys) {
    sortedManifest[key] = rawResults[key];
  }
  sortedManifest["version.json"] = undefined
  fs.writeFileSync(outputPath, JSON.stringify(sortedManifest));
}

saveSortedManifest('../wf-encyclopedia-cdn4', './version.json')
