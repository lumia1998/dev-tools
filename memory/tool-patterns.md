# 工具函数记忆

## 项目结构
```
src/renderer/src/
├── pages/
│   ├── registry.ts            # 页面注册表（tool ID → lazy component）
│   ├── Home.tsx
│   ├── Converter.tsx
│   ├── CaseConverter.tsx
│   ├── ...（其他工具页面）
│   ├── About.tsx
│   └── SettingsPage.tsx
├── tools/
│   ├── registry.ts            # 工具元数据注册（读取 JSON → ToolItem[]）
│   ├── tools.json             # 工具配置文件
│   ├── icons.ts               # 图标映射（lucide-react → name）
│   └── converter/
│       └── useConverter.ts    # 转换器逻辑 Hook
├── types/
│   └── tool.ts                # ToolItem 类型定义
├── components/
│   ├── Sidebar.tsx
│   ├── CommandPalette.tsx
│   └── ui/                    # shadcn/ui 组件
└── App.tsx                    # 极简：3 个特殊页 + registry 查找
```

## 添加新工具（3 步即可）

1. **写页面组件** — `pages/MyTool.tsx`
2. **注册到页面映射** — `pages/registry.ts` 加一行 `lazy(() => import('./MyTool'))`
3. **注册到工具配置** — `tools/tools.json` 加一条记录
   - 如果用了新 lucide 图标，在 `tools/icons.ts` 添加映射
   - 如果是新分类，无需额外操作（分类由 tools.json 的 category 字段自动驱动）

**App.tsx 不需要改。** 特殊页面（home / about / settings）硬编码在 App.tsx，其余全部走 registry。

### 需要 IPC 的工具（如 Environment Variables）

额外步骤：
1. **main/index.ts** — 添加 `ipcMain.handle('xxx:yyy', handler)`，在 `app.whenReady()` 中注册
2. **preload/index.ts** — 添加 `xxxAPI` 对象，contextBridge 暴露
3. **preload/index.d.ts** — 添加接口类型 + Window 声明
4. renderer 页面通过 `window.xxx.yyy()` 调用

## 页面注册表（pages/registry.ts）

使用 React.lazy 实现代码分割，所有工具页面按需加载：

```ts
import { lazy } from 'react'

const pageMap: Record<string, React.LazyExoticComponent<ComponentType>> = {
  'tool-id': lazy(() => import('./ToolPage')),
  // ...
}

export function getPageComponent(id: string) {
  return pageMap[id] ?? null
}
```

App.tsx 中通过 Suspense 渲染：
```tsx
const PageComponent = getPageComponent(currentPage)
if (PageComponent) {
  return (
    <Suspense fallback={<div className="page-loading">Loading…</div>}>
      <PageComponent />
    </Suspense>
  )
}
```

## 工具注册配置（tools/tools.json）

```json
{
  "id": "tool-id",
  "name": "工具名称",
  "desc": "工具描述",
  "icon": "IconName",
  "category": "分类名称",
  "categoryIcon": "CategoryIconName",
  "isNew": true
}
```

## 可用图标（tools/icons.ts）

lucide-react 图标映射：
- HardDrive, Code, Globe, Calculator, Wrench, FileJson, Network, Settings, Monitor
- Key, Shield, Clock, Link2, Hash, Lock, ShieldCheck, Binary, Keyboard, MousePointer
- Zap, Type, GitBranch, Box, Package, FileUp, FileText, CaseSensitive

## 工具页面模式

### Hook 模式
每个工具使用自定义 Hook 管理逻辑：
```typescript
// tools/[tool-name]/use[ToolName].ts
export function useToolName() {
  // 状态、计算逻辑、事件处理
  return { ... }
}
```

### 页面组件模式
```typescript
export default function ToolPage(): React.JSX.Element {
  return (
    <div className="xx-page">          {/* 全页容器 */}
      <div className="xx-card">        {/* 毛玻璃卡片 */}
        <div className="xx-header">    {/* 标题 + 副标题 */}
        {/* 输入区域、按钮、输出区域 */}
      </div>
    </div>
  )
}
```

## 可复用工具函数

### useConverter Hook
位置: `tools/converter/useConverter.ts`
功能: 单位转换、精度控制、Binary/Decimal 模式、复制到剪贴板

## UI 组件库
- shadcn/ui 组件在 `components/ui/`
- 使用 `cn()` 工具函数合并类名（clsx + tailwind-merge）
- 位置: `lib/utils.ts`

## 样式约定
- 每个工具独立 CSS 文件 `styles/[tool-name].css`
- 在 `assets/main.css` 中 `@import` 引入
- CSS 变量定义在 `base.css`
- 使用 `var(--color-xxx)` 引用颜色
