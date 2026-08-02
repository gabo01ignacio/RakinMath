# Juegos - RakinMath

## Descripción General

7 juegos educativos interactivos para practicar matemáticas. Cada juego es un archivo HTML independiente con CSS y JavaScript vanilla.

## Menú de Juegos (`v2/Juegos/menu.html`)

### Sistema de Registro
- **Modal de bienvenida:** Pide nombre, curso (4°, 5°, 6°, profesor), modo (Aprender/Practicar)
- **Persistencia:** Guarda datos en `localStorage` como `{ name, grade, mode }`
- **Filtrado:** Puede filtrar juegos por grado
- **Selector de modo:** Cambia entre "Aprender" → `Aprender/menu.html` y "Practicar" → `Juegos/menu.html`
- **Cerrar sesión:** Limpia localStorage y vuelve al index

---

## Juego 1: Duelo de Números

**Archivo:** `v2/Juegos/juego1.html`
**Grado:** 5° Básico
**Tipo:** Duelo por equipos (Azul vs Rosa)

### Mecánica
- Multiplicación y división con límite de tiempo (30s por pregunta)
- Dos equipos compiten alternadamente
- 3 vidas por equipo (corazones)

### Tipos de Preguntas
- N x 10, N x 100, N x 1000
- N x centenas
- N x N (dos dígitos)
- División con resultado entero

### Componentes UI
- Timer circular SVG con `stroke-dashoffset` animado
- Tablero de puntuación por equipo
- Overlay de fin con resultado final
- `shake` en respuesta incorrecta

---

## Juego 2: Estimaciones

**Archivo:** `v2/Juegos/juego2.html`
**Grado:** 5° Básico
**Tipo:** Selección múltiple

### Mecánica
- Redondeo de números y estimación de multiplicaciones
- Muestra N1 x N2, 4 opciones de redondeo
- 3 vidas, +10 puntos por respuesta correcta

### Objetivo
Enseñar a estimar resultados antes de calcular exactamente.

---

## Juego 3: Chefs de Fracciones

**Archivo:** `v2/Juegos/juego3.html`
**Grado:** 4° y 5° Básico
**Tipo:** Interactivo SVG

### Mecánica
- Crear fracciones equivalentes cortando pizza/chocolate/torta
- Selector de partes (+/-)
- SVG generativo de porciones
- Selección de porciones clickeables

### Verificación
- Calcula si las porciones seleccionadas equivalen a la fracción objetivo
- Toast de feedback (correcto/incorrecto)

### Objetivo
Enseñar fracciones equivalentes de forma visual y tangível.

---

## Juego 4: Arquitectas

**Archivo:** `v2/Juegos/juego4.html`
**Grado:** 4° y 5° Básico
**Tipo:** Drag & Resize interactivo

### Mecánica
- Animal pide un hábitat con perímetro o área específica
- Rectángulo draggable y redimensionable en cuadrícula de 40px
- Muestra dimensiones en tiempo real

### Misiones (5 animales)
1. **Elefante:** Requisito de área
2. **Tigre:** Requisito de perímetro
3. **Jirafa:** Requisito de área
4. **Zebra:** Requisito de perímetro
5. **Mono:** Requisito combinado

### Objetivo
Enseñar perímetro y área de rectángulos de forma práctica.

---

## Juego 5: Buscatesoros

**Archivo:** `v2/Juegos/juego5.html`
**Grado:** 5° Básico
**Tipo:** Navegación por coordenadas

### Mecánica
- Navegar un barco en plano cartesiano (X,Y) para encontrar diamantes
- Input de coordenadas
- Barco se mueve con transición CSS
- Historial de movimientos

### Niveles
- **Nivel 1:** Sin bombas, solo diamantes
- **Nivel 2:** Bombas que aparecen después de 3 puntos

### Objetivo
Enseñar coordenadas en el plano cartesiano.

---

## Juego 6: El Caldero Mágico

**Archivo:** `v2/Juegos/juego6.html`
**Grado:** 5° y 6° Básico
**Tipo:** Selector de operadores

### Mecánica
- Completar operación con 3 números y 2 operadores para llegar a un resultado objetivo
- Slots clickeables
- Botones de operadores (+, -, x, ÷)
- Evaluación con `eval()`

### Tema Visual
- Fondo oscuro (`#1a1a2e`) con tema de caldero mágico
- Pociones, oro, efectos de magia
- Colores: púrpura (`#6c5ce7`), acentos dorados (`#fdcb6e`)

### Objetivo
Enseñar orden de operaciones (PAPOMUDAS).

---

## Juego 7: Misión Robot

**Archivo:** `v2/Juegos/juego7.html`
**Grado:** 4° Básico
**Tipo:** Cálculo mental rápido

### Mecánica
- Animal con receta médica, el estudiante calcula la dosis
- Timer de 60 segundos con barra de progreso
- Flash verde en respuesta correcta, shake en incorrecta

### Tipos de Operaciones
- Suma
- Resta
- Multiplicación x2
- División x2
- Multiplicación x10
- Multiplicación x100

### Objetivo
Automatizar cálculo mental con operaciones básicas.

---

## Estilo Visual Compartido

Todos los juegos usan `apple-design.css` con:
- Cards glassmorphism
- Botones pill shape
- Spring animations en interacciones
- Toast de feedback
- Responsive design (mobile-first)

## Persistencia

- **localStorage** guarda: nombre, grado, modo, puntuaciones
- Las puntuaciones se actualizan al terminar cada ronda
- No hay sistema de ranking global (planeado)
