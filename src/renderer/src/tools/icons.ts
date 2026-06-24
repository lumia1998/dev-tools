import {
  HardDrive,
  Code,
  Globe,
  Calculator,
  Wrench,
  FileJson,
  Network,
  Settings,
  Monitor,
  Key,
  type LucideIcon
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  HardDrive,
  Code,
  Globe,
  Calculator,
  Wrench,
  FileJson,
  Network,
  Settings,
  Monitor,
  Key
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Wrench
}
