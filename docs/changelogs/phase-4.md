# Phase 4 — Editor Visual, Analytics & Identidad Visual (2026-03-27)

## Resumen

Implementación completa del editor visual de links, página de countdown, analytics con gráficas, identidad visual japonesa (wagara patterns, favicon, tipografía) y mejoras de UI/responsive en todas las páginas.

---

## 1. Schema y Validación

**`src/db/schema.ts`**
- Campo `redirectDelay: integer` en `shortLinks`
- Tabla `linkClicks` con tracking completo: país, ciudad, región, dispositivo, browser, OS, referer, UTM, sessionId, isBot, duration, linkButtonIndex

**`src/lib/schemas.ts`**
- `buttonStyleSchema`: `{ shape: rounded|sharp|pill, variant: filled|outline }`
- `linkhubLinkItemSchema`: `{ label, url, icon? }`
- `themeSchema` expandido: `accentColor`, `bgTheme`, `buttonStyle`
- `createLinkSchema` y `updateLinkSchema` reciben `redirectDelay` y `landingData`

---

## 2. Server Actions

**`src/actions/link-actions.ts`**
- `createLink()` — acepta `redirectDelay` y `landingData`
- `updateLink()` — valida con Zod antes de DB update
- `getUserLinks()` — incluye `landingData` y `redirectDelay`
- `getLinkById()` — carga datos para página de edición
- `getLinkStats()` — queries paralelas: clicks/día 30d, países, dispositivos, browsers, OS, referers, unique visitors (sessionId), bots

---

## 3. Página de Countdown

**`src/components/redirect/countdown-page.tsx`** (nuevo)
- Círculo SVG animado con `stroke-dashoffset`
- Auto-redirect al llegar a 0, botón "Ir ahora" para saltar
- Muestra título del link y nombre del creador
- Patrón seigaiha de fondo, branding DevMinds Links

**`src/app/[code]/page.tsx`** — modificado
- Branch: `redirectDelay > 0` → renderiza `CountdownPage`, else `redirect()`
- Left join con `users` para obtener nombre del creador

---

## 4. Editor Visual

```
src/components/editor/
  link-editor.tsx          ← Orquestador, split 42/58 en desktop
  editor-panel.tsx
  preview-panel.tsx        ← Panel derecho con phone frame
  preview-modal.tsx        ← Modal fullscreen mobile (AnimatePresence + Escape)
  phone-frame.tsx          ← Marco 390px, Dynamic Island, scroll independiente
  linkhub-preview.tsx      ← Preview compartido (editor + página pública)
  sections/
    basic-info.tsx
    links-section.tsx
    link-item-row.tsx
    icon-picker.tsx        ← Bottom-sheet mobile, dropdown desktop
    theme-section.tsx
    button-style-picker.tsx
    redirect-options.tsx   ← Slider countdown 0-10s
```

**Phone frame**: `max-w-120` (480px), altura `min(540px, 60vh)`, proporciones iPhone 14 Pro.

---

## 5. Mapa de Iconos

**`src/lib/platform-icons.tsx`** — 25 iconos SVG inline
- Redes: instagram, tiktok, youtube, x-twitter, facebook, linkedin, twitch, discord, spotify, threads, snapchat
- Profesional: github, website, email, behance, dribbble, portfolio, blog
- Comunicación: whatsapp, telegram
- Monetización: onlyfans, patreon, ko-fi, cashapp, paypal

---

## 6. Integración Wizard y Edición

**`src/app/create/page.tsx`** — Paso 2 usa `LinkEditor` completo

**`src/app/dashboard/[id]/edit/page.tsx`** (nuevo) — carga link con `getLinkById`, guarda con `updateLink`

**`src/components/dashboard/link-card.tsx`** — botones "Editar" y "Estadísticas"

---

## 7. Analytics con Gráficas

**`src/components/stats/stats-page.tsx`** (nuevo)
- Recharts 3.x: `AreaChart` (clicks/día), `BarChart` horizontal (dispositivos)
- Barras CSS proporcionales para países, browsers, OS, referers
- 4 KPI cards con patrón wagara propio cada una
- Tooltip con formato de fecha localizado

**Rutas nuevas:**
- `/dashboard/[id]/stats` — stats del link propio
- `/admin/links/[id]/stats` — admin puede ver stats de cualquier link

---

## 8. Patrones Wagara — Carpeta Dedicada

**Movido**: `wagara-pattern.tsx` → `src/components/patterns/wagara-pattern.tsx`

**`src/components/patterns/index.ts`** — barrel export

**Fix crítico**: `Math.random()` en `patternId` causaba hydration mismatch (SSR vs cliente). Reemplazado por `useId()` de React.

**Fix TypeScript**: `animate` tipado como `TargetAndTransition` en vez de `object` para compatibilidad con Framer Motion.

**9 patrones**: seigaiha, asanoha, shippo, ichimatsu, ryusuimon, tokusa, uroko, kikko, karakusa

**Props**: `pattern`, `color`, `opacity` (default 0.07), `static`

**Animaciones**: `drift-x`, `drift-y`, `drift-xy`, `breathe`, `none` — loops 16-25s, `useReducedMotion`

---

## 9. Identidad Visual

**`public/favicon.svg`** — 3 escamas seigaiha en beni `#B94047`, fondo shironeri, `rx="7"` estilo app icon

**`public/logo-mark.svg`** — versión 64×64 con 3 filas del patrón

**`src/app/layout.tsx`** — `metadata` con favicon SVG y apple-touch-icon

**Tipografía**: Cormorant Garamond (`--font-brand`) para el logo del header. Doto sigue en footer. Inter para UI general.

---

## 10. Redesign Visual

**Navbar**
- Animación de entrada con Framer Motion (`y: -8 → 0`)
- `AnimatePresence` en menú mobile con slide
- Logo con ícono SVG + Cormorant Garamond italic
- `max-w-7xl` con `px-10` para mejor uso del espacio en pantallas grandes

**Footer**
- Patrón tokusa sutil (`opacity=0.045`)
- Diseño compacto en dos columnas

**Home**
- Seigaiha en beni `opacity=0.10` + gradiente radial que difumina bordes
- Decorador de puntos sobre el patrón

**Dashboard**
- Stat cards individuales con patrón propio (kikko, shippo, asanoha)
- Empty state con ichimatsu

**404**
- Número grande como watermark `text-beni/15`
- Patrón uroko de fondo

**`/design`** (nueva ruta — solo debug)
- Selector interactivo de los 9 patrones con controles de opacidad, color, fondo y animación
- Grid comparativo con nombres japoneses y significados
- Paleta de 8 colores con hex y uso recomendado
- Muestra de tipografía y combinaciones

---

## 11. i18n

Secciones añadidas a `messages/es.json` y `messages/en.json`:
- `editor.*` (~30 keys)
- `countdown.*`
- `linkhub.*`
- `stats.*` (~15 keys)
- `dashboard.stats`, `dashboard.edit`

---

## Rutas Finales

| Ruta | Descripción |
|------|-------------|
| `/` | Home con patrón seigaiha |
| `/create` | Wizard + LinkEditor |
| `/dashboard` | Panel con stats y lista de links |
| `/dashboard/[id]/edit` | Edición de link existente |
| `/dashboard/[id]/stats` | Analytics del link |
| `/admin/links/[id]/stats` | Analytics admin |
| `/design` | Página de debug visual (patrones, paleta) |

## Dependencias añadidas

- `recharts@3.8.1`
