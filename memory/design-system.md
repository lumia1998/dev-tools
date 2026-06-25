# 设计系统记忆

## 整体风格
- **设计理念**: Soft Minimalism（柔和极简风）+ 代码编辑器元素
- **灵感来源**: GitHub Dark + 莫兰迪色系

## 配色方案

### 浅色模式
| 角色 | 色值 | 说明 |
|------|------|------|
| 背景 | `#F8F9FB` | 微妙渐变 |
| 表面 | `#FFFFFF` | 卡片背景 |
| 边框 | `#E8ECF0` | 柔和边框 |
| 强调色 | `#7C6BC4` | 莫兰迪蓝紫 |
| 文字 | `#1A1D21` | 主文字 |
| 次要文字 | `#5E6772` | |

### 深色模式
| 角色 | 色值 | 说明 |
|------|------|------|
| 背景 | `#0D1117` | GitHub Dark 风格 |
| 表面 | `#161B22` | |
| 强调色 | `#8B7EC8` | 莫兰迪蓝紫 |
| 文字 | `#F0F6FC` | |

## 字体系统
- **显示字体**: JetBrains Mono（等宽，用于标题、品牌、工具名称）
- **正文字体**: Inter（清晰易读）
- **代码字体**: JetBrains Mono

## 页面布局模式

### 标准工具页面
```
.xx-page                    → 全页容器，居中，padding: 40px 24px
  .xx-card                  → 毛玻璃卡片，max-width 600~780px
    .xx-header              → 居中，标题 + 副标题
    .xx-input-area          → 输入区域（textarea + 标签）
    .xx-actions             → 操作按钮行
    .xx-output-area         → 输出区域
```

### 卡片样式规范
```css
.xx-card {
  background: var(--glass-bg);           /* 毛玻璃背景 */
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
}
```

### 标题样式
```css
.xx-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.5px;
}
.xx-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
}
```

### 输入框样式
```css
.xx-textarea {
  background: var(--color-editor-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  /* focus: border-color → var(--color-accent-soft) */
}
```

### 按钮变体
| 类名 | 用途 | 样式 |
|------|------|------|
| `.btn-primary` | 主操作 | 莫兰迪蓝紫背景 + 白字 |
| `.btn-secondary` | 次要操作 | 表面背景 + 边框 |
| `.btn-ghost` | 辅助操作 | 透明 + 灰字 |
| `.btn-danger` | 危险操作 | 红色系 |

### 模式选择器（Segmented Control）
```css
.xx-mode-selector {
  display: flex; gap: 8px; padding: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
}
.xx-mode-btn.active {
  background: var(--color-accent-soft);
  color: var(--color-text-inverse);
}
```

## Home 页面
- **代码片段卡片**: `.tool-card-filename` 标签外壳 + 工具图标信息
- **搜索框**: 命令行风格（`$ search tools...`）
- **分类分组**: 按 category 自动分组，带 categoryIcon

## 关键 CSS 变量
```css
--color-accent-soft: #7C6BC4;        /* 莫兰迪蓝紫 */
--color-accent-soft-glow: rgba(124, 107, 196, 0.12);
--gradient-bg: linear-gradient(160deg, #F8F9FB 0%, #F0F2F5 40%, #F5F6F8 100%);
--glass-bg: rgba(255, 255, 255, 0.85);
--shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.06);
```

## 响应式断点
- `@media (max-width: 600px)` — 移动端适配
  - padding 减小到 `24px 16px`
  - 卡片圆角缩小到 `16px`
  - 标题字号缩小到 `20px`
  - 输入头改为纵向排列
  - 统计网格 4 列 → 2 列
