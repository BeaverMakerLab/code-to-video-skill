// 标杆案例 1：开场与直觉建立页面 (p01)
ENGINE.visual('p01', (P) => {
  // 1. 顶部标题固定
  P.title('① 漆黑藏书阁中的那束光', { accent: 'orange' });

  // 2. 背景与意象卡片
  P.card(200, 240, 680, 560, { title: '海量知识库 (N=100,000)', at: P.c(0) });
  P.icon('books', 540, 480, 140, { color: 'faint', at: P.c(0, 0.2) });
  P.text('面对数万条特征，\n系统无法同时处理所有细节。', {
    x: 240,
    y: 620,
    size: 26,
    color: 'muted',
    at: P.c(0, 0.4)
  });

  // 3. 当解说说到“手电筒”时，射出一道聚光灯并特写放大
  P.arrow(920, 520, 1140, 520, { color: 'orange', at: P.cw(1, '手电筒') });
  P.push(P.cw(1, '手电筒'), 1400, 520, 1.2);

  // 4. 右侧聚光灯目标卡片
  P.box(1180, 280, 540, 480, { fill: 'yellowF', color: 'orange', at: P.cw(1, '手电筒', 0.2) });
  P.chip(1220, 320, 220, '🔦 聚光焦点', { color: 'orange', at: P.cw(1, '手电筒', 0.3) });
  P.text('这就是**注意力（Attention）**：\n动态给不同区域赋予权重。', {
    x: 1220,
    y: 440,
    size: 30,
    color: 'ink',
    at: P.cw(1, '手电筒', 0.5)
  });
});
