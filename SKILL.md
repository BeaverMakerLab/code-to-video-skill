---
name: code-to-video
description: >-
  Turn ideas, markdown notes, code repositories, research papers, or documentation into 1080p animated explainer videos using the code-driven video engine.
  Universal skill for AI coding agents (Claude Code, Antigravity, Codex, DeepSeek Harness, OpenHands/OpenClaw, Cursor, etc.) to design storyboards, write page drawing animations in JavaScript, run layout checks, and render explainer videos.
---

# Code-to-Video Explainer Studio (通用代码化动画视频引擎)

> 📘 **详细使用说明全书请参阅**：[README.md](./README.md)（含环境体检、6大风格指南、配音方案、跨 Agent 挂载与常见排错手册）。

本技能使任何具备文件读写与命令行执行能力的 **AI Coding Agent**（如 Claude Code、Codex、DeepSeek Harness、OpenHands/OpenClaw、Antigravity、Cursor 等）化身为一名专业的**视频总导演、动画程序员与制片人**。通过驱动本地代码化视频渲染引擎，将任意文本、代码仓库、论文或创意快速转化为 1080p 60fps 墨水纸张质感的高清动画解说视频。

---

## 核心三大铁律（所有 Agent 必须严格遵守）

1. **先拍板分镜，再动手写代码（Human-in-the-Loop）**：
   在用户没有明确确认 `storyboard.json` 之前，**严禁**直接编写具体的页面代码或执行最终渲染。
2. **时间是纯函数 $Visual = f(t)$**：
   页面代码必须是时间自变量 $t$ 的纯函数。**严禁**使用 `Math.random()`（随机数必须用 `PV.rng(seed)`）、严禁 `Date.now()`、严禁 CSS transitions / `requestAnimationFrame`。
3. **字幕避让红线（Safe Zone）**：
   画布尺寸为 1920×1080。**底部区域 $y > 900$ 是字幕专用带，严禁放置任何主体图形或文字**；内容主要活动区域保持在 `x: 140~1780, y: 180~880`。

---

## 制作流水线（标准五步工作法）

### 第一步：素材消化与分镜设计 (Storyboard)

当用户提出做视频需求（或提供资料）时：
1. **确立核心隐喻**：全片提炼出 1 个贯穿始终的具象事物（例如解释注意力机制用“聚光灯”，解释缓存用“书桌上的便签”，解释流体方程用“水箱与水管”）。
2. **规划叙事结构**：
   - **Hook（前 3 秒钩子）**：提出反直觉问题或核心痛点。
   - **Intuition（直觉建立）**：引出核心比喻。
   - **Mechanism（原理剖析）**：分解核心公式或步骤。
   - **Example & Numbers（实例与计算）**：具象数据走一遍。
   - **Close（升华收敛）**：首尾呼应，回答开头的钩子。
3. **生成分镜结构**：
   输出包含 4~8 页的分镜大纲，每页明确 `id`、`section`、`say`（讲稿大意）以及 2~4 个 `beats`（具体动作拍点，含 object, action, text, camera）。
4. **请求用户确认**：
   将分镜呈现给用户，询问：“分镜大纲已生成，请检查各页面结构与叙事节奏，确认无误后我们将进入代码绘制阶段。”

详细规范与结构模板请参考：[STORYBOARD_RULES.md](./references/STORYBOARD_RULES.md)

---

### 第二步：生成讲稿与时间轴 (Script & Narration)

分镜确认后，确立 `script.js`：
1. 提取每页的具体口播台词，拆解为每句不超过 16 个中文字符的 `cues`（字幕短句）。
2. 调度语音引擎（本地 `CosyVoice 3` 端口 9880、Edge-TTS，或环境变量中的 `VOLCENGINE_TTS_API_KEY` / `ELEVENLABS_API_KEY`）生成各句音频。
3. 提取真实朗读时间戳，为每个 `cue` 赋予物理时间点（`P.c(i)` 启动时刻、`P.cw(i, '关键词')` 词级命中时刻）。

---

### 第三步：逐页动画编程 (Page Drawing Code)

每一页画面对应一个 `pages/pNN.js` 文件，使用引擎声明式 API 编写：
```javascript
ENGINE.visual('p01', (P) => {
  P.title('① 核心原理直觉', { accent: 'orange' });
  // 绑定口播第0句展开主卡片
  P.card(200, 260, 700, 480, { title: '输入特征', at: P.c(0) });
  // 念到特定词时触发箭头与高亮
  P.arrow(920, 500, 1100, 500, { at: P.cw(1, '变换') });
  // 数学公式逐步推导
  P.mathDecompose(1140, 400, 600, {
    title: '注意力得分',
    terms: [
      { latex: 'Q K^T', name: '查询与键乘积', color: 'blue', at: P.c(2) },
      { latex: '\\sqrt{d_k}', name: '缩放因子', color: 'orange', at: P.c(3) }
    ]
  });
});
```
*提示：在支持子智能体或并行任务的 Agent 环境中，可派遣多个子 Agent 并行并发编写不同页面，提升生成速度。*  
完整 API 语法与组件清单请参考：[API.md](./references/API.md)

---

### 第四步：几何与视觉自检闭环 (Automated QA Loop)

代码编写完毕后，**必须运行自检，严禁跳过**：
1. 在项目目录中执行自检工具：
   ```bash
   node engine/tools/check.mjs --only p01
   ```
2. **处理反馈**：
   - 若出现 `Collision detected` 或 `Safe zone overlap`：
   - 提取输出中的 `Fix suggestion: ...`，直接采用建议坐标调整 `pages/pNN.js` 中的坐标数值。
3. 反复自检直到各页面均为绿色通过（Passed）。

---

### 第五步：1080p 多核无头压制渲染 (Render)

所有页面自检通过后，执行并行渲染命令：
```bash
# 16:9 横屏 1080p 60fps 渲染（支持硬件加速）
node engine/tools/render.mjs --fps 60 --workers 4 --hw
```
- 输出位置位于 `<项目目录>/out/`：
  - `<项目名>-with-subtitles.mp4`（带精准双语字幕）
  - `<项目名>-no-subtitles.mp4`（纯净无字幕版）
  - 发布文案与各章节时间戳。

---

## 快捷运行模式：全自动一键出片 (CLI Run)

如果用户希望全自动端到端出一版草稿视频，也可以直接在项目根目录下调用集成的自动化 CLI：
```bash
# 端到端全自动运行（自动分析文档 -> 出分镜 -> 生成页面 -> 压制成片）
node apps/cli/dist/cli.js run <资料文件路径> --style warm-story --duration 60
```
或在需要实时时间轴预览时启动 Web 工作台：
```bash
node apps/cli/dist/cli.js serve
```

---

## 通用 Agent 跨平台调用指南 (Universal Compatibility)

本技能不绑定任何特定 Agent 运行环境，只需满足 Node.js 环境与文件读写能力：
* **Claude Code**：在项目根目录 `CLAUDE.md` 中引用本文件即可全局生效，或作为自定义命令使用。
* **OpenHands / OpenClaw**：将本技能目录置于工程内，在 `AGENTS.md` 中声明即可自动挂载。
* **DeepSeek Harness / 自建 Agent**：直接作为 System Prompt 或 Skill Tool Context 注入大模型。
* **Cursor / Windsurf**：在对话中通过 `@SKILL.md` 唤醒。
