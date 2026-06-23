# 工具函数记忆

## 项目结构
```
src/renderer/src/
├── tools/
│   ├── registry.ts          # 工具注册（读取 JSON 配置）
│   ├── tools.json           # 工具配置文件
│   ├── icons.ts             # 图标映射
│   └── converter/
│       └── useConverter.ts  # 转换器逻辑 Hook
├── types/
│   └── tool.ts              # ToolItem 类型定义
└── components/ui/           # shadcn/ui 组件
```

## 工具注册模式

### 添加新工具（推荐方式）
1. 在 `tools/tools.json` 中添加配置：
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
2. 如果使用新图标，在 `tools/icons.ts` 中添加映射
3. 创建工具页面和 Hook

### 可用图标
在 `tools/icons.ts` 中定义：
- HardDrive, Code, Globe, Calculator, Wrench, FileJson, Network, Settings

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

## Sidebar 分类菜单

### 分类图标映射
在 `components/Sidebar.tsx` 中配置：
```typescript
const categoryIcons: Record<string, React.ComponentType> = {
  '换算工具': Calculator,
  'JSON工具': Code,
  '网络工具': Globe,
  default: Wrench
}
```

### 添加新分类
1. 在 `categoryIcons` 中添加分类图标（使用 `__default` 作为默认图标 key）
2. 工具注册时使用对应的 `category` 名称
3. 分类会自动折叠/展开

## 工具实现记录

### MyIp - 内网 IP 获取
位置: `tools/my-ip/useMyIp.ts`
技术: WebRTC (RTCPeerConnection)
原理: 通过 WebRTC 的 ICE candidate 获取本机内网 IP 地址
注意: 不需要调用外部 API，纯前端实现

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
