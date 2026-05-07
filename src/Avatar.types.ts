/**
 * akong Avatar · 跨端 props
 *
 * Web 用 onClick · RN 用 onPress · 跨端写法可同时传
 */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape = 'circle' | 'square'

export interface AvatarProps {
  /** 图片 URL · 没传或加载失败显示 fallback */
  src?: string
  /** 取首字符做 fallback (无 src 或 image error 时) */
  name?: string
  /** xs=16 / sm=24 / md=32 / lg=48 / xl=64 */
  size?: AvatarSize
  /** 默认 circle */
  shape?: AvatarShape
  /** 加 1px border (default false) */
  border?: boolean
  /** Web · 整体可点 */
  onClick?: () => void
  /** RN · 整体可按 · Web 自动用 onClick · 跨端写法可同时传 */
  onPress?: () => void
  /** a11y · 屏幕阅读器朗读 · 默认用 name */
  ariaLabel?: string
}
