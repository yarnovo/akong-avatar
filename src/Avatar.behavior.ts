/**
 * 跨端行为契约 · Web + RN 都遵循
 *
 * 写法是"给定 props · 期望 · 该发生 / 不该发生"的纯描述
 * 各端测试 import 这份 spec 跑 · 行为强一致
 */

export type Outcome = 'callback-fired' | 'callback-skipped'

export interface Scenario {
  name: string
  props: { onClickPresent?: boolean }
  /** 模拟一次点击 / 按下 · 期望结果 */
  pressOutcome: Outcome
}

/** 共享场景 · Web + RN 都跑 */
export const avatarScenarios: Scenario[] = [
  {
    name: '传了 onClick · 点击触发回调',
    props: { onClickPresent: true },
    pressOutcome: 'callback-fired',
  },
  {
    name: '没传 onClick · 不该有回调发生',
    props: { onClickPresent: false },
    pressOutcome: 'callback-skipped',
  },
]

/** 取 name 首字符做 fallback · 跨端共用 */
export function avatarInitial(name?: string): string {
  if (!name) return ''
  // Array.from 处理 emoji / 多字节字符 · 取第 1 个 grapheme
  return Array.from(name.trim())[0] ?? ''
}

/** size → px · 跨端共用 (Web 走 css 变量 · RN 直接用 number) */
export const avatarSizePx: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}
