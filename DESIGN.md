# Design Brief

## Tone & Purpose
Dark cybersecurity threat intelligence platform. Users check IP addresses for malicious activity in a high-tension, high-contrast environment that reinforces the importance of digital security.

## Visual Identity
**Aesthetic**: Cyberpunk maximalism with glassmorphic cards and neon glows on deep black. Sharp edges (8px, 12px radii), high saturation neon accents, scanline overlay textures, grid-line floor effects. Signature: Monospace headers with neon text glow.

## Color Palette

| Token | OKLCH | Visual | Usage |
|---|---|---|---|
| Background | 0.08 0 0 | Deep black (#050a0f) | Page bg, safe default |
| Foreground | 0.94 0 0 | Off-white | Text, high contrast |
| Card | 0.12 0 0 | Slightly elevated black | Card surfaces |
| Primary | 0.68 0.16 262 | Neon purple | Buttons, active states |
| Secondary | 0.72 0.18 250 | Neon blue-purple | Secondary actions |
| Accent | 0.70 0.22 289 | Vivid purple | Highlights, focus states |
| Destructive | 0.62 0.24 29 | Neon red (#ff4040) | MALICIOUS/scam alerts |
| Neon Cyan | 0.72 0.20 206 | Bright cyan (#00d4ff) | Input focus, active glow |
| Neon Green | 0.78 0.20 151 | Lime green (#00ff88) | SAFE/clean results |
| Border | 0.20 0.02 264 | Dark purple-tint | Subtle dividers |

## Typography
**Display**: Geist Mono (monospace, tech-forward, neon text-glow default)
**Body**: General Sans (clean, readable, geometric)
**Mono**: Geist Mono (terminal aesthetic, code/IP display)
**Scale**: 12px (xs), 14px (sm), 16px (base), 20px (lg), 28px (2xl), 36px (3xl)

## Elevation & Depth
**Cards**: Glassmorphic with `backdrop-filter: blur(12px)`, 1px border with rgba cyan/purple, inset glow, outset shadow.
**Shadows**: No soft drop shadows — only neon glow-box-shadows. `glow-sm/md/lg` map to `0 0 10-30px` with 0.3–0.5 opacity cyan.
**Scanlines**: Repeating 2px horizontal lines at 15% opacity for cyber texture.
**Grid**: Background grid at 40px intervals, 5% opacity cyan.

## Structural Zones
**Header**: Dark card with border-b, title in neon-cyan, glassmorphic nav buttons. 2xl monospace font.
**Main Content**: Deep black background with grid-bg overlay, full scanline. Center card container.
**Input Section**: Neon-cyan bordered input with inset-glow-cyan, focus ring expands glow. Placeholder text 50% opacity.
**Result Card**: Glassmorphic with green glow (safe) or red glow (malicious). Large neon-text result label, supporting data below.
**Footer**: Border-t with dark text, minimal spacing.

## Spacing & Rhythm
**Density**: Tight, intentional — 4px, 8px, 12px, 16px, 24px, 32px intervals.
**Vertical rhythm**: 24px gaps between major sections.
**Card padding**: 24px inside, 16px gutters between cards.
**Mobile**: Stacked cards, 16px padding, 20px gaps. Breakpoints: sm (640px), md (768px), lg (1024px).

## Component Patterns
**Buttons**: Neon-bordered (cyan or purple), no fill, text-glow on hover, expand glow. Destructive: red border+glow.
**Input**: Dark bg (card), cyan border+inset-glow, white text, monospace for IPs. Focus: border-cyan, expand glow-lg.
**Cards**: All glassmorphic by default. Result cards add `glow-green` or `glow-red` on state reveal.
**Badges**: Neon-text (cyan/green/red), tiny caps, monospace, no bg.
**Loaders**: Animated cyber-scan bar (linear gradient sweep top-to-bottom, 8s loop). Pulse-glow effect.

## Motion
**Default transition**: 0.3s cubic-bezier(0.4, 0, 0.2, 1). **No bounce, no overshoot — precise cyberpunk feel.**
**Entrance**: float-in (opacity + translateY -20px, 0.6s). Applied to result card on reveal.
**Pulse**: pulse-glow (box-shadow expansion, 3s infinite). Applied to active input or threat indicators.
**Scanline**: cyber-scan (top-to-bottom sweep, 8s infinite). Overlay on result reveals.
**Three.js**: Particle network background (animated floating vertices with subtle pulsing). Result flip/burst animations (Canvas + Three.js).

## Constraints
No rounded corners above 12px (cyberpunk edge). No pastels or warm colors. No shadow blur > 20px. No animations > 1s default (except loops). All glows use box-shadow, never filter: drop-shadow. Text color always semantic (foreground/accent/destructive, never raw hex).

## Signature Detail
Neon text-glow on section headers + cyan glow borders on interactive elements. Glassmorphic cards with inset+outset dual-glow. Scanline overlay as constant visual reminder of cyber/tech context. Result card reveals with color-coded glows (green=safe, red=malicious).

## Theme
Dark
