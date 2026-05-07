import type { AvatarProps } from './Avatar.types'
import './Avatar.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong Avatar · Web · DOM `<button>` */
export function Avatar(props: AvatarProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    children,
    onClick,
    onPress,
    type = 'button',
    ariaLabel,
  } = props

  const handle = () => {
    if (disabled || loading) return
    onClick?.()
    onPress?.()
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handle}
      className={cls(
        'ak-avatar',
        `ak-avatar--${variant}`,
        `ak-avatar--${size}`,
        fullWidth && 'ak-avatar--full-width',
        loading && 'ak-avatar--loading',
      )}
    >
      {iconLeft && <span className="ak-avatar__icon">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="ak-avatar__icon">{iconRight}</span>}
    </button>
  )
}

export default Avatar
