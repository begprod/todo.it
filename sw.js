if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,o)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let s={};const f=e=>n(e,c),a={module:{uri:c},exports:s,require:f};i[c]=Promise.all(r.map((e=>a[e]||f(e)))).then((e=>(o(...e),s)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"android-chrome-144x144.png",revision:"8ab49a048c2df8ad878fc633f9710b76"},{url:"android-chrome-192x192.png",revision:"6b069882772a6813a3bbc72d32c6495a"},{url:"android-chrome-512x512.png",revision:"1681e028b0f7d586a7d7a88f6eb833ab"},{url:"apple-touch-icon.png",revision:"98dab467549649b450b30f09fc8cb969"},{url:"assets/github-mark-13bf3d1b.svg",revision:null},{url:"assets/index-6f5ded9e.js",revision:null},{url:"assets/index-edaf060e.css",revision:null},{url:"favicon-16x16.png",revision:"375507766e836f098101982a8fd8b846"},{url:"favicon-32x32.png",revision:"3791238c7e69634cf226a395ac652c3a"},{url:"favicon.ico",revision:"10898cad696dfbb81789617fd37c3f2e"},{url:"index.html",revision:"312b16de3557f685a2b5fa518b187c58"},{url:"registerSW.js",revision:"3d7fef666ec10f40f0bae413090ab43a"},{url:"screenshots/desktop.png",revision:"92607513be0ff1289c70ea81fc093848"},{url:"screenshots/mobile.png",revision:"21582ee97724c89cf25e208322b17f70"},{url:"favicon-16x16.png",revision:"375507766e836f098101982a8fd8b846"},{url:"favicon-32x32.png",revision:"3791238c7e69634cf226a395ac652c3a"},{url:"favicon.ico",revision:"10898cad696dfbb81789617fd37c3f2e"},{url:"android-chrome-144x144.png",revision:"8ab49a048c2df8ad878fc633f9710b76"},{url:"android-chrome-192x192.png",revision:"6b069882772a6813a3bbc72d32c6495a"},{url:"android-chrome-512x512.png",revision:"1681e028b0f7d586a7d7a88f6eb833ab"},{url:"apple-touch-icon.png",revision:"98dab467549649b450b30f09fc8cb969"},{url:"manifest.webmanifest",revision:"c3b3340f2209084e53426799dea7f824"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
