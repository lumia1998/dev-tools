import {
  HardDrive,
  Code,
  Globe,
  Calculator,
  Wrench,
  FileJson,
  Network,
  Settings,
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
  Settings
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Wrench
}
