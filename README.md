# Brand Studio

**Estudio inteligente de branding asistido por IA real.**

Convierte un nombre y logo en una identidad visual profesional completa.

## 🚀 Quick Start

1. Abre la aplicación
2. Haz clic en **"AI Settings"** (arriba a la derecha)
3. Configura tu proveedor de IA:
   - **OpenAI**: Necesitas una API key de OpenAI (sk-...)
   - **Anthropic**: Necesitas una API key de Anthropic (sk-ant-...)
4. Crea un nuevo proyecto
5. ¡Empieza a diseñar!

## ✨ Características

### IA Real Integrada
- ✅ **OpenAI GPT-4o** - Análisis, generación de colores, tipografía, copilot
- ✅ **Anthropic Claude** - Mismas capacidades con modelo diferente
- ✅ Tu API key, tu cuenta, tu control
- ✅ Las llamadas van directo del browser al proveedor (sin backend)

### Módulos de Diseño
- **Brand Brief** - Define la estrategia con ayuda de IA
- **Logo Lab** - Sube y analiza tu logo
- **Color Lab** - Genera paletas coherentes con contraste WCAG
- **Typography Lab** - Sistema tipográfico con escalas modulares
- **Graphic System** - Direcciones geométrica, orgánica, expresiva
- **Pattern Lab** - Patrones derivados de tu identidad
- **Photography Direction** - Guía de fotografía de marca
- **Applications** - Preview de aplicaciones de marca
- **Brand Presentation** - Genera presentación profesional

### Creative Copilot
- Chat contextual que conoce TODO tu proyecto
- Acciones rápidas: Analyze, Improve, Alternatives, Why?
- Respuestas específicas, no genéricas

## 🔧 Configuración de IA

### OpenAI
1. Ve a [platform.openai.com](https://platform.openai.com)
2. Crea una API key
3. En Brand Studio → AI Settings → Provider: OpenAI
4. Pega tu API key
5. Modelo recomendado: `gpt-4o` (default)

### Anthropic
1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una API key
3. En Brand Studio → AI Settings → Provider: Anthropic
4. Pega tu API key
5. Modelo recomendado: `claude-3-5-sonnet-20241022` (default)

### Sin IA
Puedes usar la app sin configurar IA. Todas las herramientas de diseño funcionan manualmente, pero las funciones de IA (análisis, generación, copilot) no estarán disponibles.

## 💾 Persistencia

Todos los datos se guardan en tu navegador (localStorage). No se envían a ningún servidor excepto a las APIs de IA que configures.

## 🎨 Design Philosophy

- **Neutral canvas** - La UI no compite con tu marca
- **Assist first, edit second** - La IA propone, tú decides
- **Rules vs opinions** - Distingue entre reglas verificables y principios de diseño
- **3 proposals, not 30 options** - Calidad sobre cantidad

## 📚 Documentación

- [PROJECT.md](./PROJECT.md) - Arquitectura y estado del proyecto
- [DESIGN.md](./DESIGN.md) - Design system completo

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router
- Lucide React (icons)

## ⚠️ Notas Importantes

- Las API keys se guardan SOLO en tu navegador
- Tú pagas el uso de tu propia API
- No hay backend - todo es client-side
- La IA es REAL, no mock (desde v1.1)

## 📄 Licencia

Este es un proyecto de demostración. Úsalo como base para tu propio estudio de branding.

---

**Brand Studio** - Donde las marcas cobran vida.
