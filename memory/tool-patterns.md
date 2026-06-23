# 工具函数记忆

## 项目结构
```
src/renderer/src/
├── tools/
│   ├── registry.ts          # 工具注册
│   └── converter/
│       └── useConverter.ts  # 转换器逻辑 Hook
├── types/
│   └── tool.ts              # ToolItem 类型定义
└── components/ui/           # shadcn/ui 组件
```

## 工具注册模式

### ToolItem 类型
```typescript
interface ToolItem {
  id: string
  name: string
  desc: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  category: string
  categoryIcon: React.ComponentType<{ size?: number; className?: string }>
  isNew?: boolean
}
```

### 注册新工具
在 `tools/registry.ts` 中添加：
```typescript
{
  id: 'tool-id',
  name: 'Tool Name',
  desc: '工具描述',
  icon: IconComponent,
  category: '分类名称',
  categoryIcon: CategoryIconComponent,
  isNew: true  // 可选
}
```

## 工具页面模式

### Hook 模式
每个工具使用自定义 Hook 管理逻辑：
```typescript
// tools/[tool-name]/use[ToolName].ts
export function useToolName() {
  // 状态
  // 计算逻辑
  // 事件处理
  return { ... }
}
```

### 页面组件模式
```typescript
export default function ToolPage(): React.JSX.Element {
  const { ... } = useToolName()
  
  return (
    <div className="tool-page">
      {/* Header */}
      {/* Controls */}
      {/* Content */}
    </div>
  )
}
```

## 可复用工具函数

### useConverter Hook
位置: `tools/converter/useConverter.ts`

功能:
- 单位转换计算
- 精度控制
- 复制到剪贴板
- Toast 提示

返回值:
```typescript
{
  mode: 'decimal' | 'binary'
  precision: number
  activeUnit: Unit
  toast: string | null
  copiedUnit: Unit | null
  units: readonly Unit[]
  values: Record<Unit, string>
  handleInputChange: (unit: Unit, value: string) => void
  handleModeChange: (mode: 'decimal' | 'binary') => void
  handlePrecisionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handleQuickConvert: (from: string, unit: Unit) => void
  handleCopyValue: (unit: Unit) => void
  handleCopyAll: () => void
}
```

## UI 组件库
- shadcn/ui 组件在 `components/ui/`
- 使用 `cn()` 工具函数合并类名（clsx + tailwind-merge）
- 位置: `lib/utils.ts`

## 样式约定
- CSS 变量定义在 `base.css`
- 组件样式在 `main.css`
- Tailwind 配置在 `tailwind.config.js`
- 使用 `var(--color-xxx)` 引用颜色
