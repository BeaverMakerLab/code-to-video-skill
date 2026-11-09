// 标杆案例 2：数理与物理方程逐步拆解页面 (p02)
ENGINE.visual('p02', (P) => {
  P.title('② 缩放点积注意力公式解析', { accent: 'blue' });

  // 1. 左侧容器：三矩阵输入定义
  const layout = P.splitLayout({ cols: 2, gap: 60 });

  P.card(160, 240, 680, 580, { title: 'Q / K / V 基础矩阵', at: P.c(0) });
  P.chip(200, 320, 260, 'Q (Query): 检索提问', { color: 'blue', at: P.c(0, 0.2) });
  P.chip(200, 420, 260, 'K (Key): 索引键', { color: 'orange', at: P.c(0, 0.4) });
  P.chip(200, 520, 260, 'V (Value): 真实内容', { color: 'green', at: P.c(0, 0.6) });

  // 2. 右侧核心：方程逐项高亮推导 (mathDecompose)
  P.mathDecompose(900, 360, 840, {
    title: 'Attention(Q, K, V)',
    badge: 'Core Formula',
    color: 'blue',
    terms: [
      {
        latex: 'Q K^T',
        name: '内积相似度',
        desc: '计算 Query 与每个 Key 的相关性得分',
        color: 'blue',
        at: P.c(1)
      },
      {
        latex: '\\frac{1}{\\sqrt{d_k}}',
        name: '缩放因子',
        desc: '防止维度过大导致内积进入梯度饱和区',
        color: 'orange',
        at: P.cw(2, '缩放')
      },
      {
        latex: '\\text{softmax}',
        name: '归一化',
        desc: '将得分转换为概率分布（和为 1）',
        color: 'purple',
        at: P.c(3)
      },
      {
        latex: 'V',
        name: '加权融合',
        desc: '对内容向量进行加权求和输出',
        color: 'green',
        at: P.c(4)
      }
    ]
  });
});
