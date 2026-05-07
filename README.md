# @akong/avatar

akong Avatar · 极简 · 跨端 (Web + React Native) · 圆形头像 · 加载失败首字 fallback

## Demo

[GitHub Pages 演示](https://yarnovo.github.io/akong-avatar/)

## 安装

```bash
npm i github:yarnovo/akong-avatar github:yarnovo/akong-tokens
```

## Web

```tsx
import { Avatar } from '@akong/avatar'
import '@akong/avatar/style.css'
import '@akong/tokens/style.css'  // 顶层引一次 token

<Avatar src="https://example.com/alice.png" name="Alice" size="md" />
<Avatar name="Bob" size="lg" shape="square" border />
<Avatar src={broken} name="C" onClick={() => openProfile()} />
```

## React Native

```tsx
import { Avatar } from '@akong/avatar'

<Avatar src="https://..." name="Alice" size="lg" onPress={() => ...} />
```

Metro bundler 自动按 `.native.tsx` 后缀解析 · 同 `import` 路径两端通用。

## API

| Prop | Type | Default | 说明 |
|---|---|---|---|
| src | string | — | 图片 URL · 没传或加载失败显示 fallback |
| name | string | — | 取首字 (Array.from 兼容 emoji / 多字节) |
| size | `xs` / `sm` / `md` / `lg` / `xl` | `md` | 16 / 24 / 32 / 48 / 64 px |
| shape | `circle` / `square` | `circle` | square 用 radius-md |
| border | boolean | false | 1px solid var(--ak-border) |
| onClick | () => void | — | Web · 整体可点 |
| onPress | () => void | — | RN · 整体可按 (Web 自动 fallback 到 click) |
| ariaLabel | string | name | a11y · 屏幕阅读器 |

## 行为

- 有 `src` · 默认渲染 `<img>` · onLoad 后淡入 (opacity 0 → 1, 180ms)
- `<img>` onError · 切到 fallback `<span>` 显示 name 首字
- 没 `src` 或没 `name` · fallback 显示空 (灰底)
- 有 `onClick` / `onPress` · Web 渲染成 `<button>` · RN 用 `<Pressable>` · active 0.7 opacity
- 没 click handler · Web 渲染成 `role=img` 的 `<span>` · 不可点 · 不抢焦点

## 设计原则

- **一份 props**：Web 跟 RN 共享 `Avatar.types.ts`
- **两端实现**：`Avatar.tsx` (Web) + `Avatar.native.tsx` (RN)
- **token 100% 接 @akong/tokens**：bg / border / fg / radius 全走 var
- **fallback 字体大小 ≈ size / 2.5**：跨 size 视觉比例一致
