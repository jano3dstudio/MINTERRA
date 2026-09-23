import { defineConfig } from 'vite';
export default defineConfig({base:'./',build:{target:'es2022',sourcemap:true,rollupOptions:{input:['index.html','city.html']}},server:{host:'127.0.0.1',port:5187,strictPort:true}});
