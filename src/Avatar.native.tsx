/**
 * akong Avatar · React Native 实现
 *
 * Metro bundler 默认按 `.native.tsx` 后缀解析 RN 端 · `.tsx` 解析 Web 端
 * 用方 `import { Avatar } from '@akong/avatar'` 自动取对应平台
 */

import { useState } from 'react'
import { Pressable, Image, View, Text, useColorScheme } from 'react-native'
import { tokens } from '@akong/tokens'
import type { AvatarProps } from './Avatar.types'
import { avatarInitial, avatarSizePx } from './Avatar.behavior'

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

  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const t = scheme === 'dark' ? tokens.dark : tokens.light

  const px = avatarSizePx[size]
  const fontSize = Math.max(8, Math.round(px / 2.5))
  const radius = shape === 'circle' ? tokens.radius.full : tokens.radius.md

  const showFallback = !src || errored
  const initial = avatarInitial(name)

  const clickable = !!(onClick || onPress)
  const handle = () => {
    onClick?.()
    onPress?.()
  }

  const a11y = ariaLabel ?? name ?? 'avatar'

  const containerStyle = {
    width: px,
    height: px,
    borderRadius: radius,
    backgroundColor: t.bgSubtle,
    borderWidth: border ? 1 : 0,
    borderColor: t.border,
    overflow: 'hidden' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  }

  const inner = showFallback ? (
    <Text
      style={{
        fontSize,
        color: t.fgMuted,
        fontWeight: tokens.weight.medium,
        textTransform: 'uppercase',
        lineHeight: fontSize,
      }}
    >
      {initial}
    </Text>
  ) : (
    <Image
      source={{ uri: src }}
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      style={{ width: '100%', height: '100%', opacity: loaded ? 1 : 0 }}
      resizeMode="cover"
      accessibilityLabel={a11y}
    />
  )

  if (clickable) {
    return (
      <Pressable
        onPress={handle}
        accessibilityLabel={a11y}
        accessibilityRole="imagebutton"
        style={({ pressed }: { pressed: boolean }) => ({
          ...containerStyle,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        {inner}
      </Pressable>
    )
  }

  return (
    <View accessibilityLabel={a11y} accessibilityRole="image" style={containerStyle}>
      {inner}
    </View>
  )
}

export default Avatar
