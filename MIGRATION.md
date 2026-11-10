# Code-to-Video 跨设备环境安装与迁移部署指南

本指南详细介绍在一台全新电脑或服务器上部署 **`code-to-video`** 技能及其底层渲染引擎所需的**四层环境依赖安装步骤**，确保任何设备都能在几分钟内具备 1080p 60fps 动画视频的生成能力。

---

## 一、 第一层：基础系统环境安装（三件套）

由于视频是通过代码在无头浏览器中渲染的，因此**不需要昂贵的 GPU 服务器**，任何现代办公电脑（Windows / macOS / Linux）均可流畅运行。

### 1. 安装 Node.js（版本 $\ge 22$）
用于运行工程脚手架、几何自检（Linter）及多核渲染调度器。
* **Windows**：
  ```powershell
  winget install OpenJS.NodeJS.LTS
  # 或前往 https://nodejs.org/ 下载安装 v22+
  ```
* **macOS**：
  ```bash
  brew install node@22
  ```
* **Linux (Ubuntu/Debian)**：
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### 2. 启用 pnpm 包管理器
用于管理 monorepo 依赖及创建引擎软链接（Junction / Symlink）：
```bash
corepack enable && corepack prepare pnpm@latest --activate
# 或使用 npm 全局安装：
npm install -g pnpm
```

### 3. 准备 Chromium 内核浏览器（Chrome 或 Edge）
底层引擎使用轻量级 `playwright-core`，直接通过 CDP（Chrome DevTools Protocol）复用本机已安装的浏览器，**无需额外下载数百兆的专用 Chromium**：
* **Windows**：系统自带的 **Microsoft Edge** 即可直接被引擎识别调用（也可安装 Google Chrome）。
* **macOS**：安装 Google Chrome 或 Microsoft Edge。
* **Linux（无头服务器）**：
  ```bash
  sudo apt-get update && sudo apt-get install -y chromium-browser fonts-noto-cjk
  ```
  *(注：若浏览器安装在非标准路径，可通过设置环境变量 `CHROME_PATH="/path/to/chrome"` 显式指定)*。

---

## 二、 第二层：渲染引擎与视觉资产依赖安装

在引擎工程根目录下执行安装与构建：

```bash
# 国内用户可配置镜像加速
pnpm config set registry https://registry.npmmirror.com

# 安装全部依赖并编译构建
pnpm install && pnpm build
```

执行 `pnpm install` 时，`packages/engine` 会**全自动配置好以下核心渲染资产（无需人工干预）**：
1. **内置 FFmpeg（`ffmpeg-static`）**：自动下载匹配当前操作系统的 FFmpeg 静态二进制程序。若本机装有 NVIDIA 显卡（支持 `h264_nvenc`）或 Apple Silicon（支持 `h264_videotoolbox`），渲染时加上 `--hw` 即可开启硬件加速编码。
2. **内置跨平台开源字体包**：
   - 中文手写楷体：`lxgw-wenkai-webfont`（霞鹜文楷）
   - 英文手写体：`@fontsource/caveat`
   - 代码等宽体：`@fontsource/jetbrains-mono`
   - 圆润数字体：`@fontsource/fredoka`
   *(无需在操作系统中手动安装字体，跨平台渲染 100% 像素级一致)*
3. **图形与数学排版库**：自动就绪 `roughjs`（手绘笔触）、`katex`（LaTeX 数学公式分解）、`three`（3D WebGL 渲染）及 `simple-icons`（品牌矢量图标）。

---

## 三、 第三层：语音合成（TTS）与词级时间戳环境配置

为了实现 `P.cw(i, '关键词')` 的毫秒级词音画同步，需配置以下任意一种语音合成方案：

### 方案 A：云端商业级 TTS（最省事，零本地算力要求）
直接配置系统环境变量即可：
```bash
# 中文首选：火山引擎 TTS 2.0（内置“渊博小叔”、“知性灿灿”等解说音色）
export VOLCENGINE_TTS_API_KEY="你的火山引擎Key"

# 英文首选：ElevenLabs
export ELEVENLABS_API_KEY="你的ElevenLabsKey"
```

### 方案 B：本地 CosyVoice 3 + FunASR 离线服务（零成本、无限量、支持声音克隆）
若本机拥有 NVIDIA 显卡（建议显存 $\ge 6\text{GB}$），可部署本地离线语音与强制对齐服务（监听 `9880` 端口）：
```bash
# 1. 创建 Python 3.10 虚拟环境
conda create -n cosyvoice python=3.10 -y
conda activate cosyvoice

# 2. 安装 PyTorch (CUDA) 与 FunASR 强制对齐依赖
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install funasr modelscope fastapi uvicorn soundfile

# 3. 启动本地 9880 语音服务
python voice_service.py --host 127.0.0.1 --port 9880
```
启动后运行 `node .agents/skills/code-to-video/scripts/narrate.mjs <项目路径>` 即可免 Key 合成全片配音并生成 `voice.js`。

### 方案 C：轻量免费方案（微软 Edge-TTS）
无需显卡也无需注册 API Key：
```bash
pip install edge-tts
```

---

## 四、 第四层：挂载 Skill 与一键环境体检 (Doctor)

### 1. 克隆或引入 Skill
在任意目标项目中引入本技能包：
```bash
git clone https://github.com/BeaverMakerLab/code-to-video-skill.git .agents/skills/code-to-video
```
*(若在引擎仓库之外的独立文件夹中使用，请设置环境变量指向引擎位置)*：
```powershell
# Windows PowerShell
$env:CODE_TO_VIDEO_ENGINE = "D:\path\to\packages\engine"

# macOS / Linux
export CODE_TO_VIDEO_ENGINE="/path/to/packages/engine"
```

### 2. 运行一键体检脚本 (`doctor.mjs`)
```bash
node .agents/skills/code-to-video/scripts/doctor.mjs
```
当终端输出以下全绿结果时，代表全部环境部署完毕：
```text
====================================================
   Code-to-Video 跨设备环境就绪诊断 (Doctor)       
====================================================
[✓] Node.js: v24.14.1 (已满足 >= 20 要求)
[✓] 渲染浏览器: 找到本地浏览器 (msedge.exe)
[✓] 渲染引擎核心: 已找到 (...\packages\engine)
[✓] 本地语音合成: 检测到 CosyVoice 3 正在 9880 端口运行中
====================================================
✨ 诊断完成：当前设备已完全具备运行 code-to-video 的核心能力！
```

### 3. 在各主流 AI Agent 工具中激活
* **Antigravity / Agy CLI**：默认自动识别 `.agents/skills/code-to-video`（或放入全局 `~/.gemini/config/skills/code-to-video`）。
* **Claude Code**：在项目根目录 `CLAUDE.md` 中添加引用 `.agents/skills/code-to-video/SKILL.md`。
* **OpenHands / OpenClaw**：在项目根目录 `AGENTS.md` 中添加引用。
* **Cursor / Windsurf**：在对话框中输入 `@.agents/skills/code-to-video/SKILL.md` 即可调用。
