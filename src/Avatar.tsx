import { useState } from 'react'
import type { AvatarProps } from './Avatar.types'
import { avatarInitial } from './Avatar.behavior'
import './Avatar.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong Avatar · Web · DOM `<img>` 加载失败时显示首字 fallback */
export function Avatar(props: AvatarProps) {
  const {
    src,
    name,
    size = 'md',
    shape = 'circle',
    border = false,
    onClick,
    onPress,
    ariaLabel,
  } = props

  const [errored, setErrored] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const showFallback = !src || errored
  const initial = avatarInitial(name)

  const clickable = !!(onClick || onPress)
  const handle = () => {
    onClick?.()
    onPress?.()
  }

  const className = cls(
    'ak-avatar',
    `ak-avatar--${size}`,
    `ak-avatar--${shape}`,
    border && 'ak-avatar--border',
    clickable && 'ak-avatar--clickable',
  )

  const a11y = ariaLabel ?? name ?? 'avatar'

  const inner = (
    <>
      {!showFallback && (
        <img
          className={cls('ak-avatar__img', loaded && 'ak-avatar__img--loaded')}
          src={src}
          alt={a11y}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          draggable={false}
        />
      )}
      {showFallback && (
        <span className="ak-avatar__fallback" aria-hidden={clickable ? undefined : false}>
          {initial}
        </span>
      )}
    </>
  )

  if (clickable) {
    return (
      <button type="button" aria-label={a11y} className={className} onClick={handle}>
        {inner}
      </button>
    )
  }

  return (
    <span role="img" aria-label={a11y} className={className}>
      {inner}
    </span>
  )
}

export default Avatar
