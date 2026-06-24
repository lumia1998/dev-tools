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
  Shield,
  Clock,
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
  Key,
  Shield,
  Clock
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Wrench
}
