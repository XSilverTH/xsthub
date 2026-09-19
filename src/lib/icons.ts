import type { Component } from 'vue'
import {
  Activity,
  Code,
  FolderOpen,
  Hash,
  Mail,
  MessageSquare,
  Monitor,
  Radio,
  Server,
  Smartphone,
  Terminal,
} from 'lucide-vue-next'

export const iconNames = [
  'mail',
  'hash',
  'terminal',
  'message-square',
  'server',
  'folder-open',
  'activity',
  'radar',
  'code',
  'monitor',
  'smartphone',
] as const

export type IconName = (typeof iconNames)[number]

export const iconRegistry: Record<IconName, Component> = {
  mail: Mail,
  hash: Hash,
  terminal: Terminal,
  'message-square': MessageSquare,
  server: Server,
  'folder-open': FolderOpen,
  activity: Activity,
  radar: Radio,
  code: Code,
  monitor: Monitor,
  smartphone: Smartphone,
}
