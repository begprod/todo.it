if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,o)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let f={};const a=e=>n(e,c),s={module:{uri:c},exports:f,require:a};i[c]=Promise.all(r.map((e=>s[e]||a(e)))).then((e=>(o(...e),f)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"android-chrome-144x144.png",revision:"8ab49a048c2df8ad878fc633f9710b76"},{url:"android-chrome-192x192.png",revision:"6b069882772a6813a3bbc72d32c6495a"},{url:"android-chrome-512x512.png",revision:"1681e028b0f7d586a7d7a88f6eb833ab"},{url:"apple-touch-icon.png",revision:"98dab467549649b450b30f09fc8cb969"},{url:"assets/index-DiWPfypv.css",revision:null},{url:"assets/index-H8OVsNP9.js",revision:null},{url:"favicon-16x16.png",revision:"375507766e836f098101982a8fd8b846"},{url:"favicon-32x32.png",revision:"3791238c7e69634cf226a395ac652c3a"},{url:"favicon.ico",revision:"10898cad696dfbb81789617fd37c3f2e"},{url:"index.html",revision:"45245e9e005d334ce49249547ffbc8e9"},{url:"registerSW.js",revision:"3d7fef666ec10f40f0bae413090ab43a"},{url:"favicon-16x16.png",revision:"375507766e836f098101982a8fd8b846"},{url:"favicon-32x32.png",revision:"3791238c7e69634cf226a395ac652c3a"},{url:"favicon.ico",revision:"10898cad696dfbb81789617fd37c3f2e"},{url:"android-chrome-144x144.png",revision:"8ab49a048c2df8ad878fc633f9710b76"},{url:"android-chrome-192x192.png",revision:"6b069882772a6813a3bbc72d32c6495a"},{url:"android-chrome-512x512.png",revision:"1681e028b0f7d586a7d7a88f6eb833ab"},{url:"apple-touch-icon.png",revision:"98dab467549649b450b30f09fc8cb969"},{url:"manifest.webmanifest",revision:"c3b3340f2209084e53426799dea7f824"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
