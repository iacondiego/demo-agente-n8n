# 🏠 Chatbot Inmobiliario - Next.js 14

Una interfaz de chatbot en pantalla completa especializada para el sector inmobiliario, diseñada para proyectar profesionalismo, confianza y cercanía.

## 🚀 Características

- **Pantalla Completa**: Experiencia inmersiva optimizada para atención al cliente
- **Diseño Premium**: Paleta de colores que transmite confianza y lujo (azul marino + dorado + blanco)
- **Responsive**: 100% adaptable a desktop, tablet y móvil
- **Animaciones Suaves**: Microinteracciones que mejoran la experiencia de usuario
- **Arquitectura Limpia**: Código modular y escalable con Next.js 14

## 🎨 Paleta de Colores

- **Navy Principal**: `#1a365d` - Confianza y profesionalismo
- **Dorado Elegante**: `#d4af37` - Lujo y exclusividad  
- **Dorado Claro**: `#f7e98e` - Acentos sutiles
- **Azul Intermedio**: `#2c5282` - Elementos secundarios
- **Crema Suave**: `#fefcf0` - Fondos y contrastes

## 📋 Prerequisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. **Clonar o crear el proyecto**
```bash
npx create-next-app@14 chatbot-inmobiliario
cd chatbot-inmobiliario
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
yarn dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
chatbot-inmobiliario/
├── app/                    # App Router de Next.js 14
│   ├── globals.css        # Estilos globales con Tailwind
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página home
├── components/
│   ├── chat/              # Componentes del sistema de chat
│   │   ├── ChatLayout.tsx # Contenedor principal con webhook
│   │   ├── Header.tsx     # Barra superior con estados
│   │   ├── ChatArea.tsx   # Área de conversación
│   │   ├── MessageBubble.tsx # Burbujas de mensajes
│   │   └── MessageInput.tsx  # Campo de entrada
│   ├── ui/                # Componentes UI reutilizables
│   │   └── Button.tsx     # Botón con variantes
│   └── icons/             # Iconografía
│       └── PropertyIcons.tsx
├── lib/                   # Utilidades y constantes
│   ├── utils.ts          # Funciones de utilidad
│   ├── constants.ts      # Constantes del bot + webhook config
│   └── webhook.ts        # 🔗 Servicio de integración n8n
├── types/                 # Definiciones TypeScript
│   └── chat.ts           # Tipos del sistema de chat + webhook
├── docs/                  # Documentación
│   └── WEBHOOK.md        # 📖 Guía de integración webhook
└── TAREAS.md             # Desglose de tareas del proyecto
```

## 🎯 Funcionalidades Implementadas

### ✅ Core Funcional
- [x] Estructura Next.js 14 con TypeScript
- [x] Diseño full-screen responsive
- [x] Sistema de chat básico funcional
- [x] **Integración webhook n8n**: Procesamiento inteligente de mensajes
- [x] **Sistema de fallback**: Respuestas básicas cuando webhook no disponible
- [x] **Health check automático**: Verificación de estado del webhook
- [x] Componentes modulares y reutilizables
- [x] Estados de bot (disponible, escribiendo, ausente, sin conexión)
- [x] Auto-scroll en área de chat
- [x] Animaciones de entrada de mensajes
- [x] Atajos de teclado (Enter/Shift+Enter)
- [x] **Indicadores visuales de conexión**: Estados en tiempo real

### 🔮 Funcionalidades Futuras
- [ ] Integración con API de propiedades
- [ ] Cards de propiedades dentro del chat
- [ ] Sistema de reservas y visitas
- [ ] Geolocalización
- [ ] Modo oscuro/claro
- [ ] Historial de conversaciones

## 🎪 Uso

1. **Iniciar Conversación**: El bot te saluda automáticamente
2. **Escribir Mensaje**: Usa el campo inferior para escribir
3. **Enviar**: Presiona Enter o el botón de envío
4. **Nueva Línea**: Shift+Enter para salto de línea
5. **Respuestas Inteligentes**: El bot responde según el contexto inmobiliario

## 🔧 Personalización

### Cambiar Colores
Edita `tailwind.config.js` en la sección `immobrand`:

```javascript
immobrand: {
  navy: '#tu-color-azul',      
  gold: '#tu-color-dorado',    
  // ...otros colores
}
```

### Modificar Respuestas del Bot
Edita `lib/constants.ts`:

```javascript
export const BOT_RESPONSES = {
  departamentos: ["Nueva respuesta..."],
  // ...otras categorías
}
```

### Agregar Nuevos Iconos
Importa desde Lucide React en `components/icons/PropertyIcons.tsx`

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Subir carpeta .next a Netlify
```

### Docker
```bash
docker build -t chatbot-inmobiliario .
docker run -p 3000:3000 chatbot-inmobiliario
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💼 Contacto

- **Proyecto**: Chatbot Inmobiliario
- **Versión**: 1.0.0
- **Framework**: Next.js 14
- **UI**: Tailwind CSS + Lucide Icons

---

⭐ **¡Dale una estrella si este proyecto te ayudó!** 