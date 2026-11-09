#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { narrate, directChild, cosyvoiceTts } from '../../../../packages/voice/dist/index.js';

const dir = path.resolve(process.argv[2] || '.');
const speaker = process.argv[3] || 'custom-tech_geek';

console.log(`[*] 开始为工程合成配音: ${dir}`);
console.log(`[*] 选用音色: ${speaker} (CosyVoice 3)`);

const files = {
  write(d, rel, data) {
    const f = path.join(d, rel);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, data);
  },
  read(d, rel) {
    return fs.readFileSync(path.join(d, rel));
  }
};

const tts = cosyvoiceTts({ base: 'http://127.0.0.1:9880' });

try {
  const result = await narrate(dir, {
    tts,
    voice: { speaker, rate: 0 },
    child: directChild,
    files,
    onProgress: (e) => {
      console.log(`  [${e.cached ? '已缓存' : '生成中'}] 页面 ${e.page} (${e.index + 1}/${e.total})`);
    }
  });

  console.log(`\n✓ 配音全部合成完成！总音频时长: ${result.duration.toFixed(1)}s, 合成页面段数: ${result.synthesized}`);
  if (result.warnings.length) {
    console.log('提示信息:', result.warnings);
  }
} catch (err) {
  console.error('\n✗ 配音合成失败:', err.message);
  process.exit(1);
}
