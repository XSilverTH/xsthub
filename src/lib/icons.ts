import type { Component } from 'vue'
import {
  Activity,
  Code,
  FolderOpen,
  Hash,
  Mail,
  MessageSquare,
  Radio,
  Server,
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
}
