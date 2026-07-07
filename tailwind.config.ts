/**
 * Tailwind CSS v4 Configuration
 * 
 * En Tailwind v4, la mayoría de la configuración se hace en CSS usando @theme.
 * Este archivo es opcional y solo se necesita para configuraciones avanzadas.
 * 
 * Los colores personalizados están definidos en app/(frontend)/globals.css
 */
import type { Config } from 'tailwindcss';

const config: Config = {
  // En v4, content se detecta automáticamente
  darkMode: 'class',
};

export default config;
