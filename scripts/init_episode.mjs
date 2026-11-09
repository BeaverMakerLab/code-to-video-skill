#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const title = process.argv[2] || '新建解说视频';
const targetDir = path.resolve(process.argv[3] || path.join(process.cwd(), 'draft-video'));
const style = process.argv[4] || 'warm-story';

// 1. 动态寻找引擎位置（优先支持环境变量，其次向上寻找 packages/engine，保障跨目录与新设备迁移）
function findEngineDir() {
  if (process.env.CODE_TO_VIDEO_ENGINE && fs.existsSync(process.env.CODE_TO_VIDEO_ENGINE)) {
    return path.resolve(process.env.CODE_TO_VIDEO_ENGINE);
  }
  let curr = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(curr, 'packages', 'engine');
    if (fs.existsSync(path.join(candidate, 'tools', 'project.mjs'))) {
      return candidate;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return null;
}

const engineDir = findEngineDir();
if (!engineDir) {
  console.error('❌ 未找到视频渲染引擎目录 (packages/engine)！');
  console.error('💡 提示：在新设备上，请设置环境变量 CODE_TO_VIDEO_ENGINE=/path/to/engine');
  process.exit(1);
}

const projectModule = path.join(engineDir, 'tools', 'project.mjs');
const { createProject, linkProject } = await import(`file://${projectModule.replace(/\\/g, '/')}`);

console.log(`正在初始化视频工程: ${targetDir}`);
console.log(`标题: ${title} | 风格: ${style}`);
console.log(`使用引擎: ${engineDir}`);

createProject(targetDir, { title, style, lang: 'zh' });
linkProject(targetDir);

console.log(`\n✓ 视频项目脚手架已生成就绪！`);
console.log(`工程目录: ${targetDir}`);
console.log(`后续步骤: 编写 ${targetDir}/storyboard.json 与 pages/*.js`);
