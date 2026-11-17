import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // El esquema de progreso se consume desde specs/ (fuente de verdad), fuera de frontend/.
  server: { fs: { allow: ['..'] } },
});
