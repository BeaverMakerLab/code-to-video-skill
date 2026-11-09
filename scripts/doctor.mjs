#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

console.log('====================================================');
console.log('   Code-to-Video 跨设备环境就绪诊断 (Doctor)       ');
console.log('====================================================\n');

let allPassed = true;

// 1. Node.js 版本
const nodeVersion = process.versions.node;
const major = parseInt(nodeVersion.split('.')[0], 10);
if (major >= 20) {
  console.log(`[✓] Node.js: v${nodeVersion} (已满足 >= 20 要求)`);
} else {
  console.log(`[✗] Node.js: v${nodeVersion} (过低，建议升级至 Node 22+)`);
  allPassed = false;
}

// 2. 浏览器检测 (Chrome / Edge)
let browserFound = false;
const commonPaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser'
];
for (const p of commonPaths) {
  if (fs.existsSync(p)) {
    console.log(`[✓] 渲染浏览器: 找到本地浏览器 (${path.basename(p)})`);
    browserFound = true;
    break;
  }
}
if (!browserFound) {
  try {
    execSync('where chrome || where msedge || which google-chrome', { stdio: 'ignore' });
    console.log('[✓] 渲染浏览器: 环境变量中检测到 Chrome/Edge');
    browserFound = true;
  } catch {
    console.log('[!] 渲染浏览器: 未在默认路径找到 Chrome/Edge，若渲染报错请安装或设置 CHROME_PATH');
  }
}

// 3. FFmpeg 检测
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  console.log('[✓] FFmpeg: 系统全局已安装且在 PATH 中');
} catch {
  console.log('[!] FFmpeg: 全局未找到 ffmpeg 命令（渲染引擎内置了捆绑版本，通常仍可直接压制）');
}

// 4. 视频引擎检索
let engineDir = null;
let curr = process.cwd();
for (let i = 0; i < 6; i++) {
  const candidate = path.join(curr, 'packages', 'engine');
  if (fs.existsSync(path.join(candidate, 'tools', 'project.mjs'))) {
    engineDir = candidate;
    break;
  }
  const parent = path.dirname(curr);
  if (parent === curr) break;
  curr = parent;
}
if (engineDir) {
  console.log(`[✓] 渲染引擎核心: 已找到 (${engineDir})`);
} else if (process.env.CODE_TO_VIDEO_ENGINE && fs.existsSync(process.env.CODE_TO_VIDEO_ENGINE)) {
  console.log(`[✓] 渲染引擎核心: 环境变量配置 (${process.env.CODE_TO_VIDEO_ENGINE})`);
} else {
  console.log('[✗] 渲染引擎核心: 未检测到 packages/engine 目录！');
  console.log('    新设备迁移请确保同级包含 packages/engine，或设置 CODE_TO_VIDEO_ENGINE 环境变量');
  allPassed = false;
}

// 5. 语音 TTS 检测
const checkTts = async () => {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:9880/voices', (res) => {
      if (res.statusCode === 200) {
        console.log('[✓] 本地语音合成: 检测到 CosyVoice 3 正在 9880 端口运行中（可免 Key 离线配音）');
      } else {
        console.log('[!] 本地语音合成: 9880 服务响应异常');
      }
      resolve();
    });
    req.on('error', () => {
      console.log('[-] 本地语音合成: 9880 端口未开启（若需配音可配置 VOLCENGINE_TTS_API_KEY、使用 Edge-TTS，或启动本地语音服务）');
      resolve();
    });
    req.setTimeout(1000, () => {
      req.destroy();
      resolve();
    });
  });
};

await checkTts();

console.log('\n====================================================');
if (allPassed) {
  console.log('✨ 诊断完成：当前设备已完全具备运行 code-to-video 的核心能力！');
} else {
  console.log('⚠️ 诊断完成：检测到部分缺项，请参照上方提示进行环境微调。');
}
console.log('====================================================\n');
