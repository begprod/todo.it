import '@/assets/css/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  BiLayoutSidebarInset,
  HiDotsVertical,
  HiPlus,
  MdCancelOutlined,
  MdCopyallRound,
  MdDeleteoutline,
  MdDone,
  MdMoveupRound,
  OiGrabber,
} from 'oh-vue-icons/icons';

import App from './App.vue';
import { router } from './router';

addIcons(
  BiLayoutSidebarInset,
  HiDotsVertical,
  HiPlus,
  MdCancelOutlined,
  MdCopyallRound,
  MdDeleteoutline,
  MdDone,
  MdMoveupRound,
  OiGrabber,
);

const app = createApp(App);

app.component('v-icon', OhVueIcon);

app.use(createPinia());
app.use(router);

app.mount('#app');
