/**
 * Web 端组件测试 · vitest + @testing-library/react
 *
 * 覆盖:
 * - 基础渲染 (image src / fallback initial / 空 fallback)
 * - 图片加载失败 → fallback (fireEvent.error)
 * - size · shape · border 反映在 dom
 * - onClick / onPress 触发
 * - 行为契约共享 spec
 * - 边界 (空 props · 多字节首字符)
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Avatar } from '../src/Avatar'
import { avatarScenarios, avatarInitial } from '../src/Avatar.behavior'

describe('Avatar (Web) · 渲染', () => {
  it('传 src · 渲染 <img>', () => {
    const { container } = render(<Avatar src="https://example.com/a.png" name="Alice" />)
    const img = container.querySelector('img.ak-avatar__img') as HTMLImageElement
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toBe('https://example.com/a.png')
  })

  it('没传 src · 显示 name 首字 fallback', () => {
    const { container } = render(<Avatar name="Alice" />)
    expect(container.querySelector('img')).toBeNull()
    const fb = container.querySelector('.ak-avatar__fallback')
    expect(fb?.textContent).toBe('A')
  })

  it('没 src + 没 name · fallback 是空 (灰底圆)', () => {
    const { container } = render(<Avatar />)
    const fb = container.querySelector('.ak-avatar__fallback')
    expect(fb).toBeTruthy()
    expect(fb?.textContent).toBe('')
    expect(container.querySelector('.ak-avatar')).toBeTruthy()
  })

  it('img onError → 切到 fallback 显示首字', () => {
    const { container } = render(<Avatar src="https://broken.example/x.png" name="Bob" />)
    const img = container.querySelector('img') as HTMLImageElement
    expect(img).toBeTruthy()
    fireEvent.error(img)
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('.ak-avatar__fallback')?.textContent).toBe('B')
  })

  it('img onLoad → 加 loaded class (淡入)', () => {
    const { container } = render(<Avatar src="https://example.com/a.png" name="Alice" />)
    const img = container.querySelector('img') as HTMLImageElement
    expect(img.classList.contains('ak-avatar__img--loaded')).toBe(false)
    fireEvent.load(img)
    expect(img.classList.contains('ak-avatar__img--loaded')).toBe(true)
  })
})

describe('Avatar (Web) · size / shape / border', () => {
  it('5 个 size 都生效', () => {
    for (const s of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
      const { container } = render(<Avatar size={s} name="X" />)
      expect(container.querySelector(`.ak-avatar--${s}`)).toBeTruthy()
    }
  })

  it('shape=square · 加 square class', () => {
    const { container } = render(<Avatar shape="square" name="S" />)
    expect(container.querySelector('.ak-avatar--square')).toBeTruthy()
    expect(container.querySelector('.ak-avatar--circle')).toBeNull()
  })

  it('shape default · circle', () => {
    const { container } = render(<Avatar name="C" />)
    expect(container.querySelector('.ak-avatar--circle')).toBeTruthy()
  })

  it('border=true · 加 border class', () => {
    const { container } = render(<Avatar border name="B" />)
    expect(container.querySelector('.ak-avatar--border')).toBeTruthy()
  })

  it('border default false · 不加 border class', () => {
    const { container } = render(<Avatar name="N" />)
    expect(container.querySelector('.ak-avatar--border')).toBeNull()
  })
})

describe('Avatar (Web) · 交互', () => {
  it('传 onClick · 渲染成 <button> · 点击触发', () => {
    const onClick = vi.fn()
    render(<Avatar name="C" onClick={onClick} />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('没 onClick / onPress · 渲染成 role=img · 不可点', () => {
    render(<Avatar name="N" />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByRole('img', { name: 'N' })).toBeInTheDocument()
  })

  it('onClick + onPress 同传 · 都触发', () => {
    const onClick = vi.fn()
    const onPress = vi.fn()
    render(<Avatar name="X" onClick={onClick} onPress={onPress} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('只传 onPress · Web 端 click 也触发', () => {
    const onPress = vi.fn()
    render(<Avatar name="P" onPress={onPress} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('clickable 加 ak-avatar--clickable class', () => {
    const { container } = render(<Avatar name="C" onClick={() => {}} />)
    expect(container.querySelector('.ak-avatar--clickable')).toBeTruthy()
  })
})

describe('Avatar (Web) · 行为契约 (共享 spec)', () => {
  for (const sc of avatarScenarios) {
    it(sc.name, () => {
      const onClick = vi.fn()
      const props = sc.props.onClickPresent ? { onClick } : {}
      const { container } = render(<Avatar name="X" {...props} />)
      const btn = container.querySelector('button')
      if (btn) fireEvent.click(btn)
      else fireEvent.click(container.querySelector('.ak-avatar')!)
      if (sc.pressOutcome === 'callback-fired') {
        expect(onClick).toHaveBeenCalledOnce()
      } else {
        expect(onClick).not.toHaveBeenCalled()
      }
    })
  }
})

describe('Avatar (Web) · a11y + 边界', () => {
  it('ariaLabel 优先 · 没传时取 name', () => {
    render(<Avatar name="Alice" onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Alice' })).toBeInTheDocument()
  })

  it('ariaLabel 显式覆盖 name', () => {
    render(<Avatar name="Alice" ariaLabel="user avatar" onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'user avatar' })).toBeInTheDocument()
  })

  it('多字节首字符 (中文) · 取第 1 字', () => {
    const { container } = render(<Avatar name="张三" />)
    expect(container.querySelector('.ak-avatar__fallback')?.textContent).toBe('张')
  })

  it('emoji name · 取第 1 grapheme', () => {
    expect(avatarInitial('🚀 Rocket')).toBe('🚀')
  })

  it('name 头空格 · 跳过空格取首字', () => {
    expect(avatarInitial('  Alice')).toBe('A')
  })
})
