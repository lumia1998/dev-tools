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
  Monitor
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Wrench
}
