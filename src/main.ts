import '@/assets/css/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  MdCancelOutlined,
  MdCopyallRound,
  MdDeleteoutline,
  MdDone,
  HiDotsVertical,
  HiPlus,
} from 'oh-vue-icons/icons';

import App from './App.vue';
import { router } from './router';

addIcons(
  MdCancelOutlined,
  MdCopyallRound,
  MdDeleteoutline,
  MdDone,
  HiDotsVertical,
  HiPlus,
);

const app = createApp(App);

app.component('v-icon', OhVueIcon);

app.use(createPinia());
app.use(router);

app.mount('#app');
