# DALIRIUM - Museo Virtual Salvador Dalí

## 🎨 Características

- **Nav superior**: Visible en tablet y desktop con navegación horizontal
- **Sidebar**: Solo visible en móvil (se oculta automáticamente en pantallas md+)
- **Fuente Dalí**: Tipografía personalizada para títulos
- **Responsive**: Diseño adaptativo con Tailwind CSS
- **React Router**: Navegación SPA

## 📱 Comportamiento Responsive

### Móvil (< 768px)
- Botón hamburguesa visible
- Sidebar deslizable desde la izquierda
- Logo centrado en el nav superior
- Sin navegación horizontal

### Tablet/Desktop (≥ 768px)
- Sidebar oculto completamente
- Navegación horizontal visible en el nav superior
- Logo a la izquierda
- Sin botón hamburguesa

## 🚀 Instalación

```bash
npm install
npm run dev
```

## 📁 Estructura

```
src/
├── components/
│   └── layout/
│       ├── TopNav.jsx      # Nav superior (siempre visible)
│       ├── Sidebar.jsx     # Sidebar móvil (solo <md)
│       └── MainLayout.jsx  # Layout principal
├── pages/
│   └── Home.jsx            # Página de inicio
├── routes/
│   └── AppRoutes.jsx       # Configuración de rutas
├── App.jsx
├── main.jsx
└── index.css               # Estilos + fuente Dalí

public/
└── fonts/
    └── dali____.ttf        # Fuente Dalí
```

## 🎨 Paleta de Colores

- **Dorado**: #d4af37
- **Negro profundo**: #0a0a0a
- **Negro intenso**: #050505
- **Grises neutros**: Escala de Tailwind

## ✨ Próximos pasos

Puedes agregar más páginas en `/src/pages/` y rutas en `AppRoutes.jsx`:

```jsx
<Route path="/cuadros" element={<Cuadros />} />
<Route path="/esculturas" element={<Esculturas />} />
// etc...
```