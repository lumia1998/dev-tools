import { HardDrive, Code } from 'lucide-react'
import type { ToolItem } from '@renderer/types/tool'

export const tools: ToolItem[] = [
  {
    id: 'data-size-converter',
    name: 'Data Size Converter',
    desc: '数据大小单位转换，支持 Binary/Decimal 模式',
    icon: HardDrive,
    category: '换算工具',
    categoryIcon: Code,
    isNew: true
  }
]
