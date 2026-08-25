# RakinMath - Resumen de Cambios

## Proyecto
Plataforma educativa de matemáticas para estudiantes chilenos (4°, 5°, 6° básico). HTML/CSS/JS puro, sin frameworks.

---

## Fases Completadas

### FASE 1: Mascot SVG - Rakín
Búho con lentes, colors: púrpura `#af52de`, azul `#007aff`, naranja `#ff9500`.

| Archivo | Descripción |
|---------|-------------|
| `v2/Recursos/rakin-normal.svg` | Rakín neutral |
| `v2/Recursos/rakin-happy.svg` | Rakín contento |
| `v2/Recursos/rakin-thinking.svg` | Rakín pensando (empty states) |
| `v2/Recursos/rakin-confused.svg` | Rakín confundido (404) |
| `v2/Recursos/rakin-waving.svg` | Rakín saludando (héroes) |

---

### FASE 2: Página 404
- **Archivo:** `v2/404.html`
- Rakín confundido con gradiente animado
- Símbolos matemáticos flotantes
- Dos botones CTA (Volver al inicio / Ver juegos)
- Soporte light/dark theme
- **Netlify:** `netlify.toml` actualizado con redirect 404

---

### FASE 3: Loader/Splash Screen
Barra de progreso de 3px con gradiente Duolingo (`#58cc02 → #1cb0f6 → #ce82ff`).

| Página | Estado |
|--------|--------|
| `v2/index.html` | ✅ |
| `v2/login.html` | ✅ |
| `v2/Juegos/menu.html` | ✅ |
| `v2/Juegos/menu-v3.html` | ✅ |
| `v2/Aprender/4to/menu.html` | ✅ |
| `v2/Aprender/5to/menu.html` | ✅ |

---

### FASE 4: Menú V3 - Estilo Duolingo
**Archivo principal:** `v2/Juegos/menu.html` (antes era `menu-v3.html`)

#### Hero Section
- Emojis flotantes con animación `float`
- Título con nombre de usuario (gradiente verde)
- Stats cards: Juegos jugados, Medallas, Racha diaria
- Progress bar dinámica (4to + 5to combinado)

#### Filtros
- 4 botones: Todos (verde), 4° (azul), 5° (naranja), 6° (púrpura)
- Efecto bounce al hacer click
- Filtrado por grado

#### Game Cards (13 juegos)
| Juego | Grado | Color |
|-------|-------|-------|
| Duelo de Números | 5° | cyan |
| Estimaciones | 5° | yellow |
| Chefs de Fracciones | 4°, 5° | purple |
| Arquitectas | 4°, 5° | green |
| Buscatesoros | 5° | orange |
| El Caldero Mágico | 5°, 6° | pink |
| Misión Robot | 4° | cyan |
| Cálculo Mental | 4°, 5° | indigo |
| Laboratorio de Pociones | 4°, 5° | purple |
| El Mercado Chileno | 4°, 5° | green |
| Pizza Master | 4°, 5° | orange |
| Geometrix Builder | 4°, 5° | indigo |
| Ruta Matemática | 4°, 5°, 6° | green |

#### Efectos
- Sparkle particles en hover
- Shimmer effect (línea de luz)
- Badge "✓ Jugado" dinámico
- Stagger animations (cada card con delay)

---

### FASE 5: Menús de Aprender
**Archivos:** `v2/Aprender/4to/menu.html` y `v2/Aprender/5to/menu.html`

- Rakín saludando en hero (SVG `rakin-waving.svg`)
- Barra de progreso por grado (4° azul, 5° púrpura)
- Cards de materias completadas en verde con ✓
- Scripts `rk-progress.js` y `rk-medals.js` integrados
- Scroll-to-top button

---

### FASE 6: Sistema de Progreso
**Archivo:** `v2/stats/rk-progress.js`

```javascript
RK.Progress.isPageComplete(pageId)    // boolean
RK.Progress.isGamePlayed(gameId)      // boolean
RK.Progress.getGradoProgress('4to')   // 0-100
RK.Progress.getGradoProgress('5to')   // 0-100
RK.Progress.getGamesPlayedCount()     // number
```

- Persistencia en `localStorage` (`rakin_progress_{user}`)
- Tracking de páginas visitadas
- Tracking de juegos jugados

---

### FASE 7: Sistema de Medallas
**Archivo:** `v2/stats/rk-medals.js`

15 medallas definidas:
| ID | Nombre | Condición |
|----|--------|-----------|
| `first-game` | Primer Juego | Completar primer juego |
| `all-games` | Maestro de Juegos | Juguar los 13 juegos |
| `perfect-quiz` | Perfecto | Quiz 100% |
| `streak-3` | Constancia | Racha de 3 días |
| `streak-7` | Semana Perfecta | Racha de 7 días |
| `streak-30` | Leyenda | Racha de 30 días |
| `4to-complete` | Graduado 4° | Completar 4° básico |
| `5to-complete` | Graduado 5° | Completar 5° básico |
| `fractions-master` | Maestro Fracciones | Dominar fracciones |
| `geometry-star` | Estrella Geométrica | Dominar geometría |
| `speed-demon` | Velocidad | Completar en tiempo récord |
| `explorer` | Explorador | Visitar todas las secciones |
| `helper` | Ayudante | Compartir con un amigo |
| `night-owl` | Búho Nocturno | Estudiar después de las 9pm |
| `early-bird` | Madrugador | Estudiar antes de las 7am |

```javascript
RK.Medals.getAll()           // Array de medallas earned
RK.Medals.getCount()         // number
RK.Medals.getAllDefinitions() // Array con todas las definiciones
```

---

### FASE 8: Empty States con Rakín
5 páginas placeholder actualizadas con `rakin-thinking.svg`:

| Página | Título |
|--------|--------|
| `numeros.html` | Números |
| `geometria.html` | Geometría |
| `algebra.html` | Álgebra |
| `datos.html` | Datos |
| `fracciones.html` | Fracciones |

---

### FASE 9: Navegación Mejorada

#### Scroll-to-Top Button
- Aparece al scrollear 400px+
- Gradiente azul `#1cb0f6`
- Animación suave de entrada/salida
- Soporte mobile (44px en vez de 48px)

#### Medals Button en Nav
- Botón 🏅 con contador de medallas
- Abre modal de logros al hacer click
- Efecto hover amarillo

---

### FASE 10: Pulido Final

#### Transiciones de Página
```css
body { animation: pageIn 0.4s var(--ease) both; }
```

#### Scrollbar Personalizada
- 8px de ancho
- Track: `var(--bg-subtle)`
- Thumb: `var(--border)`
- Hover: `var(--text-dim)`

#### Modal de Medallas (Popup)
- Hero header con gradiente amarillo/rosa
- Emoji 🏆 grande con animación bounce
- Stats row: Obtenidas / Total / Completado
- Progress bar con gradiente verde-teal
- Medal cards con:
  - Icono dentro de círculo con borde
  - Borde verde + glow cuando earned
  - Badge 🔒 cuando locked
  - Fecha de obtención
  - Animación hover (scale + rotate + shadow)
- Empty state con 🎯 cuando no hay medallas
- Cierre: ✕ / click afuera / tecla Escape
- Bloqueo de scroll del body al abrir
- Responsive: 3 columnas en móvil

---

## Paleta de Colores

### Duolingo (Menús)
| Variable | Color | Uso |
|----------|-------|-----|
| `--duo-green` | `#58cc02` | Botones primarios, progress |
| `--duo-blue` | `#1cb0f6` | Links, scroll-to-top |
| `--duo-purple` | `#ce82ff` | 6° básico, acentos |
| `--duo-yellow` | `#ffc800` | Medallas, hover |
| `--duo-orange` | `#ff9600` | 5° básico |
| `--duo-pink` | `#ff86d0` | Cards rosa |
| `--duo-red` | `#ff4b4b` | Logout, cerrar |
| `--duo-teal` | `#2ee5c9` | Progress fill |

### Apple Design (Aprender)
| Variable | Color | Uso |
|----------|-------|-----|
| `--accent` | `#007aff` | Links, focus |
| `--green` | `#34c759` | Completado |
| `--purple` | `#af52de` | Mascot |

---

## Archivos Principales

| Archivo | Líneas | Descripción |
|---------|--------|-------------|
| `v2/Juegos/menu.html` | ~2221 | Menú principal Duolingo |
| `v2/Juegos/menu-v3.html` | ~2221 | Backup del menú |
| `v2/404.html` | ~150 | Página de error |
| `v2/stats/rk-progress.js` | ~120 | Sistema de progreso |
| `v2/stats/rk-medals.js` | ~200 | Sistema de medallas |
| `v2/Aprender/4to/menu.html` | ~280 | Menú 4° básico |
| `v2/Aprender/5to/menu.html` | ~260 | Menú 5° básico |
| `netlify.toml` | ~10 | Configuración deploy |

---

## Deploy
- **Host:** Netlify
- **Publish directory:** `v2`
- **404:** Redirect a `/404.html`
- **PWA:** `v2/manifest.json` + iconos en `v2/logos/`

---

## Próximos Pasos Pendientes
- [ ] Deploy a Netlify (excluido del plan actual)
- [ ] Integrar juegos existentes con sistema de progreso
- [ ] Agregar más medallas según uso real
- [ ] Analytics de usage
- [ ] PWA service worker
