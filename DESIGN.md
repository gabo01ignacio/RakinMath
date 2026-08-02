# Sistema de Diseño - RakinMath

## Archivo Base

`v2/Aprender/apple-design.css` y `v2/Juegos/apple-design.css` (copia compartida).

## Custom Properties (CSS Variables)

### Colores
```css
--bg: #f5f5f7;                    /* Fondo claro */
--bg-card: rgba(255,255,255,0.8); /* Tarjetas glass */
--text: #1d1d1f;                  /* Texto principal */
--text-secondary: #6e6e73;        /* Texto secundario */
--text-tertiary: #86868b;         /* Texto terciario */
--accent: #007aff;                /* Acento azul */
--success: #34c759;               /* Verde */
--warning: #ff9500;               /* Naranja */
--purple: #af52de;                /* Morado */
--danger: #ff3b30;                /* Rojo */
--info: #5ac8fa;                  /* Teal */
--pink: #ff2d55;                  /* Rosa */
--indigo: #5856d6;                /* Indigo */
--border: rgba(0,0,0,0.06);       /* Bordes sutiles */
--border-strong: rgba(0,0,0,0.1); /* Bordes fuertes */
```

### Border Radius
```css
--radius-sm: 12px;
--radius-md: 20px;
--radius-lg: 28px;
--radius-xl: 36px;
--radius-pill: 980px;
```

### Spacing
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

### Timing
```css
--timing-fast: 150ms;
--timing-normal: 250ms;
--timing-slow: 400ms;
```

### Spring Curves
```css
--spring-default: cubic-bezier(0.2, 0.9, 0.3, 1.2);
--spring-smooth: cubic-bezier(0.25, 0.1, 0.15, 1);
```

## Componentes UI

### Navegación (`.nav`)
- Barra fija de 52px de alto
- Fondo sólido blanco con glassmorphism: `blur(30px) saturate(180%)`
- Border-bottom sutil
- z-index alto para estar sobre contenido

### Tarjetas (`.card`)
- Border-radius: 28px
- Backdrop-filter: blur + saturate
- Hover: `translateY(-4px)` con transición suave
- Padding: 24px
- Sombra sutil en hover

### Botones
- **Primary:** Fondo azul, texto blanco, pill shape (980px radius)
- **Success:** Fondo verde, texto blanco
- **Ghost:** Sin fondo, borde sutil, texto primary
- **Hover:** Transform scale(1.02), sombra
- **Press:** Scale(0.98) con spring curve
- **Disabled:** Opacity 0.5, cursor not-allowed

### Inputs
- Border-radius: 20px
- Padding: 14px 18px
- Focus: Ring azul de 3px
- Font-weight: 600
- Background: `var(--bg)`

### Badges
- Pill shape (980px radius)
- Padding: 6px 14px
- Font-size: 12px
- Font-weight: 600
- Borde sutil

### Toast
- Posición fija abajo
- Aparece con `slideUp` + fade
- Border-radius: 16px
- Padding: 14px 20px
- Glassmorphism

### Modal
- Overlay: blur background
- Card: `scaleIn` animation
- Spring curves para apertura
- Botón de cerrar en esquina

### Progreso (`.progress-track`)
- Altura: 8px
- Border-radius: pill
- Fill: transición de width
- Color: acento

## Clases de Utilidad

### Layout
- `.container` - Contenedor centrado con max-width
- `.grid` - CSS Grid responsive
- `.flex` - Flexbox
- `.gap-*` - Spacing entre elementos

### Texto
- `.text-center` - Texto centrado
- `.text-lg`, `.text-xl`, `.text-2xl` - Tamaños
- `.font-bold`, `.font-extrabold` - Pesos
- `.text-secondary`, `.text-tertiary` - Colores de texto

### Espaciado
- `.p-*`, `.px-*`, `.py-*` - Padding
- `.m-*`, `.mx-*`, `.my-*` - Margin
- `.gap-*` - Gap en flex/grid

### Visibilidad
- `.hidden` - Oculto
- `.mobile-only` - Solo en móvil
- `.desktop-only` - Solo en desktop

## Glassmorphism

Efecto utilizado en nav, cards y modales:
```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(30px) saturate(180%);
-webkit-backdrop-filter: blur(30px) saturate(180%);
```

En dark mode:
```css
background: rgba(28, 28, 30, 0.75);
backdrop-filter: blur(30px) saturate(180%);
```

## Responsive Breakpoints

```css
@media (max-width: 480px)  { /* Móvil pequeño */ }
@media (max-width: 640px)  { /* Móvil grande */ }
@media (max-width: 700px)  { /* Tablet pequeño */ }
@media (max-width: 768px)  { /* Tablet */ }
@media (max-width: 900px)  { /* Desktop pequeño */ }
@media (max-width: 1024px) { /* Desktop */ }
```

## Patrones de Layout

### Landing Page
- Hero a pantalla completa
- Secciones con padding vertical generoso
- Cards en grid responsive (1 col móvil, 3 cols desktop)
- Footer con copyright

### Páginas de Aprender
- Header con navegación y botón volver
- Contenido centrado (max-width ~800px)
- Secciones apiladas verticalmente
- Quiz al final

### Juegos
- Header con info del juego (nivel, vidas, timer)
- Área de juego principal
- Controles interactivos
- Toast de feedback
