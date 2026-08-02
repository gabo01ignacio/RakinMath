# Animaciones - RakinMath

## Archivo Base

Definidas en `apple-design.css` y utilizadas en toda la plataforma.

## Animaciones CSS

### fadeIn
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```
Uso: Elementos que aparecen gradualmente.

### slideUp
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Uso: Elementos que entran desde abajo (cards, secciones, toast).

### scaleIn
```css
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
```
Uso: Modales, cards que aparecen.

### popIn
```css
@keyframes popIn {
  0% { opacity: 0; transform: scale(0); }
  70% { transform: scale(1.03); }
  100% { opacity: 1; transform: scale(1); }
}
```
Uso: Badges del hero, elementos con "rebote" al aparecer.

### shake
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}
```
Uso: Respuestas incorrectas en todos los juegos.

### bounce
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
```
Uso: Elementos con movimiento sutil (diamante en juego5).

### pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```
Uso: Puntos verdes animados, indicadores de carga.

## Spring Curves (Bezier Custom)

```css
--spring-default: cubic-bezier(0.2, 0.9, 0.3, 1.2);
```
Rebote sutil al final. Usado en: hover de cards, press de botones.

```css
--spring-smooth: cubic-bezier(0.25, 0.1, 0.15, 1);
```
Suave sin rebote. Usado en: transiciones de theme toggle, navegación.

## Animaciones en la Landing Page

### Scroll Animations (IntersectionObserver)
- Elementos con clase `.animate-on-scroll` se animan al entrar en viewport
- `slideUp` con delays escalonados (cada 50ms)
- Hero chip: `popIn`
- Hero title: `slideUp` escalonado
- Feature cards: `slideUp` escalonado
- Un solo `observer` observa todos los elementos

### Theme Toggle
- Transiciones suaves en colores de fondo y texto
- Duración: `var(--timing-normal)` (250ms)

## Animaciones en Juegos

### Timer Circular SVG (Juego 1)
- `stroke-dashoffset` animado con CSS transition
- Cuenta regresiva visual de 30 segundos

### Timer Barra (Juego 7)
- `width` transition de 100% a 0%
- Duración: 60 segundos
- Cambio de color a rojo cuando queda poco tiempo

### Feedback de Respuesta
- **Correcta:** Flash verde (background temporal)
- **Incorrecta:** `shake` + flash rojo

### Toast Notifications
- Aparecen con `slideUp` desde abajo
- Desaparecen con fade después de 2-3 segundos
- Se apilan si hay múltiples

### Barco (Juego 5)
- `transition` en propiedad `left/top`
- Movimiento suave entre coordenadas

### Balanza (Ecuaciones)
- `transform: rotate()` con transición CSS
- Inclina lado pesado

### Barras de Gráfico (Datos)
- `height` transition de 0 a valor final
- Delay escalonado por barra (cada 100ms)
- Efecto de crecimiento

### Segmentos de Fracción
- `background` transition al cambiar selección
- Feedback visual de porciones seleccionadas

### Celdas de Cuadrícula
- `background` transition en hover
- Efecto de selección en celdas clickeadas

## Animaciones en Páginas de Aprender

### Stagger Children
- Secciones con delay de 80ms entre cada una
- Cada sección ejecuta `slideUp` secuencialmente

### Boards Visuales
- Transiciones en celdas de suma vertical
- Animación de lleva 1 paso a paso

### Constructor de Gráfico
- Barras crecientes con `height` transition
- Labels que aparecen después de la barra

## Duraciones Recomendadas

| Tipo | Duración | CSS Variable |
|------|----------|--------------|
| Rápida | 150ms | `--timing-fast` |
| Normal | 250ms | `--timing-normal` |
| Lenta | 400ms | `--timing-slow` |
| Spring | 300-500ms | `--spring-default` |

## Buenas Prácticas

1. **Usar `transform` y `opacity`** para animaciones (GPU-accelerated)
2. **Evitar animar `width`, `height`, `top`, `left`** cuando sea posible
3. **Usar `will-change`** en elementos animados frecuentemente
4. **Respetar `prefers-reduced-motion`** para accesibilidad
5. **Mantener animaciones sutiles** - no más de 2 animaciones simultáneas por elemento
6. **Usar spring curves** para interacciones (hover, press)
7. **Usar ease-out** para elementos que entran
8. **Usar ease-in** para elementos que salen
