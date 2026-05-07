import type { ReactNode } from 'react'

export type AvatarVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link'
export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  variant?: AvatarVariant
  size?: AvatarSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  children?: ReactNode
  onClick?: () => void
  /** RN 用 onPress · Web 自动用 onClick · 跨端写法可同时传 */
  onPress?: () => void
  /** Web 提交表单等 · RN 忽略 */
  type?: 'button' | 'submit' | 'reset'
  /** a11y */
  ariaLabel?: string
}
