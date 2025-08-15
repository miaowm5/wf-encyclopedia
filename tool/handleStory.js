import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname, basename } from 'path';

/**
 * 列出指定目录下的所有一级文件夹（完整路径）
 */
const listDirectories = (dirPath) => {
  return readdirSync(dirPath)
    .filter(name => statSync(join(dirPath, name)).isDirectory())
    .map(name => join(dirPath, name));
};

/**
 * 合并所有 scenario.json 文件内容
 * @param {string} parentDir 目标父目录
 * @returns {object} 合并后的 JSON 对象
 */
const mergeScenarios = (parentDir) => {
  const result = {};
  const subDirs = listDirectories(parentDir);

  subDirs.forEach(subDir => {
    const scenarioPath = join(subDir, 'scenario.json');
    try {
      const data = readFileSync(scenarioPath, 'utf-8');
      const json = JSON.parse(data);
      Object.assign(result, json);
    } catch (err) {
      // 如果没有 scenario.json 或解析失败则跳过
    }
  });

  return result;
};

const pathList = [
  'story_quest/main_chapter_01',
  'story_quest/main_chapter_02',
  'story_quest/main_chapter_03',
  'story_quest/main_chapter_04',
  'story_quest/main_chapter_05',
  'story_quest/main_chapter_06',
  'story_quest/main_chapter_07',
  'story_quest/main_chapter_08',
  'story_quest/main_chapter_09',
  'story_quest/main_chapter_10',
  'story_quest/main_chapter_11',
  'story_quest/main_chapter_12',
  'story_event_quest/1anv',
  'story_event_quest/2anv',
  'story_event_quest/2halfanv',
  'story_event_quest/3halfanv',
  'story_event_quest/anv3',
  'story_event_quest/crown_beasts',
  'story_event_quest/cyberpunk01',
  'story_event_quest/cyberpunk02_hero',
  'story_event_quest/desert_bonds_01',
  'story_event_quest/dollprincess01',
  'story_event_quest/ny20',
  'story_event_quest/smr20',
  'story_event_quest/smr21',
  'story_event_quest/smr22',
  'story_event_quest/valen_20',
  'story_event_quest/valen_22',
  'story_event_quest/vcollabo_towa',
  'story_event_quest/xm19',
  'story_event_quest/yokai_emaki01',
  'advent_event/advent_event_001',
  'advent_event/advent_event_002',
  'advent_event/advent_event_003',
  'advent_event/advent_event_004_e',
  'advent_event/advent_event_005',
  'advent_event/advent_event_007',
  'advent_event/advent_event_008_wind',
  'advent_event/bcollabo',
  'advent_event/boss_epuration',
  'advent_event/gcollabo',
  'advent_event/hw20',
  'advent_event/kcollabo',
  'advent_event/rcollabo',
  'advent_event/scollabo',
  'advent_event/ucollabo',
  'advent_event/zcollabo'
]

pathList.forEach((targetPath) => {
  const targetDir = `./public/orderedmap/story/${targetPath}`;
  const merged = mergeScenarios(targetDir);

  // 以目录名称作为文件名，储存到该目录同级的文件夹下
  const parentFolder = dirname(targetDir);
  const dirName = basename(targetDir);
  const outputPath = join(parentFolder, `${dirName}.json`);
  writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`已保存合并结果到: ${outputPath}`);
});
