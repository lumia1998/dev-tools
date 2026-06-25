# TypeScript 编码规范

## 项目 tsconfig 配置

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitAny": false,
  "noImplicitReturns": true
}
```

## 类型安全原则

### 禁止事项
- **禁止 `any`** — 项目中零 `any` 使用，不写 `: any`、`as any`、`<any>`、`any[]`
- **禁止 `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck`** — 遇到类型问题应正确定义类型，而非压制错误
- **禁止未使用的变量和参数** — `noUnusedLocals` + `noUnusedParameters` 为 `true`，编译会报错

### `any` 的唯一例外
当且仅当以下场景可酌情使用：
- 第三方库无类型导出且无法手写 `.d.ts` 时（极少见）
- JSON 反序列化后结构完全未知且需透传时（如 `JSON.parse` 返回值，应立即断言为具体类型）

### 推荐的类型写法
```typescript
// ✅ 具体类型
const [text, setText] = useState('')
const [mode, setMode] = useState<'component' | 'full'>('component')
const [copied, setCopied] = useState(false)

// ✅ 泛型约束
function useConverter<T extends Record<string, unknown>>(config: T) { ... }

// ✅ 联合类型代替 any
type InputValue = string | number | null

// ✅ unknown 代替 any（类型不确定时）
const data: unknown = JSON.parse(raw)
if (isMyType(data)) { /* 安全使用 */ }

// ❌ 不要这样写
const [text, setText] = useState<any>('')
const data: any = JSON.parse(raw)
```

## 变量声明规范

### 命名
| 类型 | 规则 | 示例 |
|------|------|------|
| 变量 / 函数 | camelCase | `handleClick`, `isLoading` |
| 类型 / 接口 | PascalCase | `ToolItem`, `GenConfig` |
| 常量 | camelCase（非 UPPER_CASE） | `CHAR_POOLS`, `SAMPLES` |
| CSS 类名 | kebab-case（在 JSX 中字符串） | `className="ta-page"` |
| 组件文件 | PascalCase | `CaseConverter.tsx` |
| Hook 文件 | camelCase `use` 前缀 | `useConverter.ts` |

### useState 推断
- 基础类型（string / number / boolean / null）让 TS 自动推断，不写泛型
- 复杂类型（对象、联合类型、数组非空）需显式泛型
```typescript
// ✅ 自动推断
const [input, setInput] = useState('')
const [count, setCount] = useState(0)

// ✅ 需要泛型
const [mode, setMode] = useState<Mode>('component')
const [items, setItems] = useState<ToolItem[]>([])
```

### 未使用参数处理
函数签名中如有未使用的参数（如事件回调），用 `_` 前缀：
```typescript
// ✅ 下划线前缀标记未使用
.replace(/(^|[.!?]\s+)([a-z])/g, (_match, sep, char) => sep + char.toUpperCase())

// ❌ 不能留空不写（会触发 noUnusedParameters）
.onChange={(e) => someFunc()}  // e 未使用但没标记
```

## React 类型规范

### 组件返回值
```typescript
// ✅ 显式返回类型
export default function MyPage(): React.JSX.Element { ... }

// ✅ 组件 props 用 interface
interface Props {
  onSelectTool: (id: string) => void
  collapsed?: boolean
}
```

### 事件处理
```typescript
// ✅ React 内置事件类型
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }
const handleKeyDown = (e: React.KeyboardEvent) => { ... }
```

### HTML 元素引用
```typescript
// ✅ 泛型指定元素类型
const inputRef = useRef<HTMLInputElement>(null)
const scrollRef = useRef<HTMLDivElement>(null)
```

## 检查命令
```bash
npm run typecheck:web    # 渲染进程类型检查（主要使用）
npm run typecheck        # 全量检查（main + renderer）
npm run lint             # ESLint 检查
```
