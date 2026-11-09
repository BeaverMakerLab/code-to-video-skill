# Code-to-Video 跨设备迁移与共享指南

本指南用于指导如何将 **`code-to-video`** 技能以及其底层渲染能力迁移到一台全新的电脑或服务器上，使新设备能够无缝调用各类 AI Agent 生成 1080p 视频。

---

## 一、 快速迁移（极简三步法）

### 步骤 1：在新设备上安装基础软件
新设备只需满足以下标准开发者环境（几乎所有现代开发电脑都具备）：
1. **Node.js**：版本 $\ge 20$（推荐 Node 22+）
2. **浏览器**：安装 Google Chrome 或 Microsoft Edge（Windows 默认自带 Edge）
3. **包管理器**：`npm install -g pnpm`

---

### 步骤 2：拷贝与安装依赖
将本项目代码（或包含 `packages/engine` 与 `.agents/skills/code-to-video` 的压缩包）拷贝到新设备：

```bash
# 1. 进入项目根目录
cd 000AI生成短代码视频

# 2. 安装项目依赖（国内用户如遇网络慢可配置镜像）
pnpm install
```

---

### 步骤 3：一键环境健康体检 (Doctor)
在新设备上运行内置的体检诊断工具，验证所有组件是否就绪：

```bash
node .agents/skills/code-to-video/scripts/doctor.mjs
```
终端会逐项自检：
- [✓] Node.js 版本
- [✓] Chrome / Edge 渲染引擎检测
- [✓] FFmpeg 编解码器检测
- [✓] 核心渲染引擎路径探查
- [✓] 语音合成可用性探查

全部显示 `[✓]` 后，新设备即已 100% 具备出片能力！

---

## 二、 在不同 AI Agent 工具中挂载此 Skill

在新设备上打开你习惯的 AI Agent 工具，即可按如下方式挂载本技能：

### 1. Claude Code
在新设备项目的根目录建立 `CLAUDE.md`，添加以下内容：
```markdown
## 视频生成技能
当用户要求制作/生成讲解视频时，请严格阅读并遵照 `.agents/skills/code-to-video/SKILL.md` 的步骤执行。
```

### 2. Antigravity / Agy CLI
Skill 默认位于 `.agents/skills/code-to-video`，Antigravity 启动后会自动发现并载入该技能。
* 若希望全机器所有项目通用，可将该目录复制到 `~/.gemini/config/skills/code-to-video`。

### 3. OpenHands / OpenClaw 等开源 Agent
在项目根目录的 `AGENTS.md` 中引用 `.agents/skills/code-to-video/SKILL.md`。

### 4. DeepSeek Harness 或自建 Agent 框架
将 `SKILL.md` 与 `references/API.md` 作为 System Prompt 或 Agent Tool Context 注入给大模型。

### 5. Cursor / Windsurf
在聊天框中直接通过 `@.agents/skills/code-to-video/SKILL.md` 引用。

---

## 三、 新设备配音配置（根据场景选择一种即可）

1. **零成本免 Key 离线配音（本地 CosyVoice 3）**：
   - 若新设备有独立显卡，可启动本地 CosyVoice 语音服务（监听 9880 端口）。
2. **轻量免配置配音（微软 Edge-TTS）**：
   - 运行 `pip install edge-tts`，全网爆款“云希”音色免费调用，自带词级时间戳。
3. **商业级播音（火山引擎 / ElevenLabs）**：
   - 设置系统环境变量：
     ```bash
     export VOLCENGINE_TTS_API_KEY="你的火山引擎Key"
     # 或
     export ELEVENLABS_API_KEY="你的ElevenLabsKey"
     ```

---

## 四、 跨目录独立运行（解耦技巧）

如果你把 `.agents/skills/code-to-video` 拷贝到了一个**完全独立的新项目目录**中，只需配置一个环境变量指向主引擎位置，脚本就会自动跨目录建立链接：

```bash
# Windows PowerShell
$env:CODE_TO_VIDEO_ENGINE = "D:\path\to\packages\engine"

# Linux / macOS
export CODE_TO_VIDEO_ENGINE="/path/to/packages/engine"
```
