import { createApp } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import '@/assets/css/main.css';
import { router } from '@/router';
import { initPersistence } from '@/persistence';
import App from '@/App.vue';

const bootstrap = async () => {
  const pinia = createPinia();
  setActivePinia(pinia);

  await initPersistence(pinia);

  const app = createApp(App);
  app.use(pinia);
  app.use(router);
  app.mount('#app');
};

void bootstrap().catch(() => {
  const appElement = document.getElementById('app');

  if (appElement) {
    appElement.textContent = 'Unable to load data. Reload the page.';
  }
});
