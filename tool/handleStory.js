// 1. 读取 orderedmap/story 目录下的子目录
// 2. 对于 character_story_quest 子目录下的所有子目录，按目录名前缀进行分组，将仅后缀数字不同的子目录作为同一组的内容（例如 advanced_soldier_001、advanced_soldier_002、advanced_soldier_003 为同一组），读取同组所有目录下的 scenario.json 文件，合并其内容后保存为 output/story/character_story_quest 目录下的 前缀.json 文件
// 3. 对于其他子目录下的所有孙目录，读取每个孙目录下的 scenario.json 文件，合并其内容后保存到 output/story/子目录名称/孙目录名称.json 文件中（例：将 orderedmap/story/advent_event/advent_event_001/advent_event_001_01/scenario.json 和 orderedmap/story/advent_event/advent_event_001/advent_event_001_02/scenario.json 合并后保存为 output/story/advent_event/advent_event_001.json ）

const fs = require('fs');
const path = require('path');

// 输入和输出的基础路径
const inputBase = path.join(__dirname, 'orderedmap/story');
const outputBase = path.join(__dirname, 'output/scenario');

// 保证目录存在
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 合并多个 JSON 文件内容
function mergeJsonFiles(files) {
  let result = {};
  for (const file of files) {
    try {
      const data = fs.readFileSync(file, 'utf-8');
      const json = JSON.parse(data);
      result = { ...result, ...json }
    } catch (err) {
      console.log(err)
      // 跳过不存在或解析失败的文件
    }
  }
  return result;
}

// 按前缀分组（如 advanced_soldier_001、advanced_soldier_002 分为 advanced_soldier）
function groupByPrefix(dirs) {
  const groups = {};
  dirs.forEach(dir => {
    // 匹配前缀（去掉最后的 _数字）
    const match = dir.match(/^(.+?)(?:_\d+)?$/);
    const prefix = match ? match[1] : dir;
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(dir);
  });
  return groups;
}

// 处理 character_story_quest 目录
function handleCharacterStoryQuest() {
  const questDir = path.join(inputBase, 'character_story_quest');
  if (!fs.existsSync(questDir)) return;
  // 获取所有子目录
  const subDirs = fs.readdirSync(questDir).filter(d => fs.statSync(path.join(questDir, d)).isDirectory());
  // 按前缀分组
  const groups = groupByPrefix(subDirs);

  const outDir = path.join(outputBase, 'character_story_quest');
  ensureDirSync(outDir);

  // 遍历每组，合并 scenario.json
  Object.entries(groups).forEach(([prefix, dirs]) => {
    const files = dirs.map(d => path.join(questDir, d, 'scenario.json')).filter(f => fs.existsSync(f));
    const merged = mergeJsonFiles(files);
    fs.writeFileSync(path.join(outDir, `${prefix}.json`), JSON.stringify(merged, null, 2));
  });
}

// 处理其他子目录（如 advent_event 等）
function handleOtherSubDirs() {
  // 获取除 character_story_quest 外的所有子目录
  const subDirs = fs.readdirSync(inputBase).filter(d => fs.statSync(path.join(inputBase, d)).isDirectory() && d !== 'character_story_quest');
  subDirs.forEach(subDir => {
    const subDirPath = path.join(inputBase, subDir);
    // 获取所有孙目录
    const grandDirs = fs.readdirSync(subDirPath).filter(d => fs.statSync(path.join(subDirPath, d)).isDirectory());
    const outDir = path.join(outputBase, subDir);
    ensureDirSync(outDir);

    grandDirs.forEach(grandDir => {
      const grandDirPath = path.join(subDirPath, grandDir);
      // 递归查找 scenario.json 文件
      let files = [];
      function findScenarioJson(dir) {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          if (fs.statSync(itemPath).isDirectory()) {
            findScenarioJson(itemPath);
          } else if (item === 'scenario.json') {
            files.push(itemPath);
          }
        });
      }
      findScenarioJson(grandDirPath);

      if (files.length > 0) {
        const merged = mergeJsonFiles(files);
        fs.writeFileSync(path.join(outDir, `${grandDir}.json`), JSON.stringify(merged, null, 2));
      }
    });
  });
}

// 主入口
function main() {
  ensureDirSync(outputBase);
  handleCharacterStoryQuest();
  handleOtherSubDirs();
}

main();
