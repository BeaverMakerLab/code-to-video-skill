# Code-to-Video 绘图 API 手册

每个页面是一个独立的 JavaScript 文件（如 `pages/p01.js`），通过 `ENGINE.visual('p01', (P) => { ... })` 挂载绘制逻辑。

---

## 一、 画布坐标系与时间系统

1. **画布规格**：
   - 分辨率：`1920 × 1080`，左上角为原点 `(0, 0)`。
   - 内容建议工作区：`x: 140 ~ 1780, y: 180 ~ 880`。
   - **绝对红线**：底部 $y > 900$ 为字幕安全区，不得放置图形或文本。
2. **时间自变量与锚点**：
   - 动画时间以当前页面的秒数为单位。
   - `P.c(i, dt)`：第 `i` 句台词开始时间 + `dt` 秒。
   - `P.cw(i, '关键词', dt)`：当第 `i` 句台词念到“关键词”该字词的瞬间 + `dt` 秒（**词级音画同步核心**）。
   - `P.ce(i)`：第 `i` 句台词结束时间。
   - `P.endT`：整页口播结束时间。
3. **色彩系统**：
   - 标准墨水色：`ink` (深黑墨色), `soft` (次级深色), `muted` (铅灰色), `faint` (淡灰辅助色)。
   - 点缀色：`blue`, `orange`, `red`, `green`, `purple`, `yellow`。
   - 背景填充色：在色名后加 `F` 表示半透明浅填充（如 `blueF`, `greenF`, `redF`）。
   - 纸张底色：`paper`。

---

## 二、 基础绘制图元（Primitives）

| API 签名 | 说明与参数 | 示例 |
| :--- | :--- | :--- |
| `P.title(str, { accent })` | 页面左上角标题，自带波浪下划线 | `P.title('① 测不准原理直觉', { accent: 'orange' })` |
| `P.text(str, { x, y, size, color, w, align, mode, cps, at })` | 动态文字排版。支持 Markdown 加粗 `**文本**`、代码块 `` `code` ``、彩色标记 `{r:红字}`、`{b:蓝字}` 等 | `P.text('能量守恒', { x: 300, y: 400, size: 28, color: 'ink', at: P.c(1) })` |
| `P.box(x, y, w, h, { fill, color, r, dur, at })` | 手绘质感矩形框（带微手绘笔触） | `P.box(200, 300, 400, 250, { fill: 'blueF', color: 'blue', at: P.c(0) })` |
| `P.arrow(x1, y1, x2, y2, { color, dashed, at })` | 手绘单向箭头 | `P.arrow(620, 425, 780, 425, { color: 'soft', at: P.cw(0, '传递') })` |
| `P.circle(cx, cy, d, { fill, color, at })` | 手绘圆形 | `P.circle(960, 540, 120, { fill: 'yellowF', color: 'orange', at: P.c(2) })` |
| `P.card(x, y, w, h, { title, at })` | 预设带标题的容器卡片 | `P.card(150, 200, 500, 600, { title: '状态空间', at: P.c(0) })` |
| `P.chip(x, y, w, text, { color, h, size, at })` | 药丸型标签徽章 | `P.chip(200, 240, 180, '✓ 已收敛', { color: 'green', at: P.c(1) })` |
| `P.ring(cx, cy, w, h, { color, at })` | 红色/彩色手绘线圈（圈注重点） | `P.ring(500, 400, 160, 80, { color: 'red', at: P.cw(2, '关键') })` |
| `P.underline(x, y, w, { color, at })` | 手绘强调下划线 | `P.underline(300, 450, 200, { color: 'orange', at: P.c(1) })` |
| `P.code(lines, { x, y, w, size, at })` | 代码卡片（自带语法高亮与逐行高亮 `.hl(row)`） | `P.code(['def forward(x):', ' return x * 2'], { x: 200, y: 300, size: 24, at: P.c(0) })` |
| `P.icon(name, cx, cy, size, { at, color })` | 矢量图标（person, brain, robot, gear, bulb, shield, rocket, cpu 等） | `P.icon('brain', 960, 400, 100, { color: 'purple', at: P.c(0) })` |

---

## 三、 科研与数理公式分解（Scientific & Math）

对于数理方程（微积分、流体力学、注意力得分、损失函数等），必须使用逐步分解动画：

```javascript
P.mathDecompose(x, y, w, {
  title: '连续性方程 (Continuity Equation)',
  terms: [
    {
      latex: '\\frac{\\partial \\rho}{\\partial t}',
      name: '非定常项',
      desc: '密度随时间变化率',
      color: 'blue',
      at: P.c(0)
    },
    {
      latex: '\\nabla \\cdot (\\rho \\mathbf{u})',
      name: '对流项',
      desc: '净流入质量通量',
      color: 'orange',
      at: P.c(1)
    },
    {
      latex: '= 0',
      name: '守恒源项',
      desc: '质量无产生亦无湮灭',
      color: 'green',
      at: P.c(2),
      // 支持消项或变换动画
      cancel: { at: P.c(3), condition: '稳态流动 (∂/∂t -> 0)' }
    }
  ]
});
```

---

## 四、 运镜与镜头语言（Camera Presets）

运镜通过快速切入/平移增强节奏感，切忌慢速漂移：
- `P.push(at, x, y, s=1.25)`：在 `at` 时刻快速特写放大推入到指定坐标。
- `P.pan(at, x, y)`：平移视窗。
- `P.slam(at, x, y, s=1.2)`：重击强调震颤。
- `P.back(at)`：拉回全局全景广角。
