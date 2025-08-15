import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

/**
 * 获取指定目录下所有一级文件夹（完整路径）
 */
const listDirectories = (dirPath) => {
  return readdirSync(dirPath)
    .filter(name => statSync(join(dirPath, name)).isDirectory())
    .map(name => join(dirPath, name));
};

/**
 * 按前缀分组，仅后缀数字不同的文件夹
 */
const groupByPrefix = (dirNames) => {
  const groups = {};
  dirNames.forEach(dir => {
    // 匹配类似 advanced_soldier_001
    const match = basename(dir).match(/^(.+?)_\d+$/);
    if (match) {
      const prefix = match[1];
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(dir);
    }
  });
  return groups;
};

/**
 * 合并 scenario.json 文件内容
 */
const mergeScenarios = (dirs) => {
  const result = {};
  dirs.forEach(subDir => {
    const scenarioPath = join(subDir, 'scenario.json');
    try {
      const data = readFileSync(scenarioPath, 'utf-8');
      const json = JSON.parse(data);
      Object.assign(result, json);
    } catch (err) {
      // 跳过不存在或解析失败的文件
    }
  });
  return result;
};

// 主逻辑
const parentDir = './public/orderedmap/story/character_story_quest';
const subDirs = listDirectories(parentDir);
const groups = groupByPrefix(subDirs);

Object.entries(groups).forEach(([prefix, dirs]) => {
  const merged = mergeScenarios(dirs);
  const outputPath = join(parentDir, `${prefix}.json`);
  writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`已保存合并结果到: ${outputPath}`);
});
