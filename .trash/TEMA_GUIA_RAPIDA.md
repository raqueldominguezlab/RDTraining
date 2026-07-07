# 🎨 PERSONALIZACIÓN DE COLORES - GUÍA RÁPIDA

## Cómo cambiar los colores de forma fácil

El sitio tiene un **sistema de temas flexible** que permite cambiar los colores sin tocar código.

---

## ⚡ Lo Más Rápido (2 minutos)

### Opción 1: Cambiar colores en CSS

1. Abre: `/app/(frontend)/globals.css`
2. Busca la sección `:root {`
3. Cambia los valores de color:

```css
--color-primary-500: #3b82f6;    /* Cambiar este valor */
--color-primary-600: #2563eb;    /* Por tu color favorito */
```

**LISTO** - Los cambios se aplican automáticamente ✨

---

## 🎯 Más Completo (5 minutos)

### Opción 2: Cambiar toda la paleta

1. Abre: `/src/config/theme.ts`
2. Modifica el objeto `theme`
3. Guarda el archivo

Este archivo tiene TODA la paleta de colores. Cambias aquí y afecta a:
- Tailwind config
- CSS variables
- Todos los componentes

---

## 🔎 ¿Dónde encuentro el color que quiero?

### Herramientas útiles:
- **[Coolors.co](https://coolors.co)** - Los mejores colores + paletas
- **[Color Hexa](https://www.colorhexa.com)** - Info de cualquier color
- **DevTools del navegador** - Inspecciona elemento + picka color

---

## 📝 Ejemplos de cambios

### Cambiar a ROJO:
```css
--color-primary-500: #ef4444;
```

### Cambiar a VERDE:
```css
--color-primary-500: #22c55e;
```

### Cambiar a NARANJA:
```css
--color-primary-500: #f59e0b;
```

---

## 📂 Archivos Importantes

| Archivo | Propósito | Dificultad |
|---------|-----------|-----------|
| `/app/(frontend)/globals.css` | Cambiar colores rápido | ⭐ Fácil |
| `/src/config/theme.ts` | Cambiar paleta completa | ⭐⭐ Medio |
| `/tailwind.config.ts` | Configuración avanzada | ⭐⭐⭐ Difícil |

---

## ✅ Lo que ya está configurado

✓ **Paleta de colores completa**  
✓ **Tailwind CSS integrado**  
✓ **CSS Variables para runtime**  
✓ **Dark mode soportado**  
✓ **Componentes responsive**  
✓ **Animaciones suaves**  

---

## 📖 Documentación Completa

Para más detalles, lee:
- `/docs/PERSONALIZACION_COLORES.md` - Guía detallada
- `/docs/CMS_INTEGRATION.md` - Integración con Payload CMS

---

## 🚀 DeploY

Antes de desplegar:
1. ✅ Verifica que los colores se ven bien
2. ✅ Prueba en móvil y desktop
3. ✅ Recarga la página (Ctrl+Shift+R)
4. ✅ Limpia el caché si es necesario

---

## 🆘 Soporte

Si algo no funciona:
1. Recarga la página (Ctrl+Shift+R)
2. Limpia el caché del navegador
3. Verifica que el código de color sea válido (hex)
4. Revisa la consola (F12) por errores

**¡Los cambios son instantáneos! No necesitas compilar.**
