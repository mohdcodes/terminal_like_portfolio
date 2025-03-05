// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//     include: ['regenerator-runtime/runtime']
//   },
//   build: {
//     commonjsOptions: {
//       include: [/regenerator-runtime/]
//     }
//   }
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'regenerator-runtime/runtime'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Ensure compatibility with CJS/ESM
    },
  },
});
