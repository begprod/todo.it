if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/todo.it/sw.js', { scope: '/todo.it/' })})}