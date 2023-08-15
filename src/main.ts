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
  OiGrabber,
} from 'oh-vue-icons/icons';

import App from './App.vue';
import { router } from './router';
import { clickOutside } from '@/directives/clickOutsideDirective';

addIcons(
  BiLayoutSidebarInset,
  HiDotsVertical,
  HiPlus,
  MdCancelOutlined,
  MdCopyallRound,
  MdDeleteoutline,
  MdDone,
  OiGrabber,
);

const app = createApp(App);

app.directive('click-outside', clickOutside);

app.component('v-icon', OhVueIcon);

app.use(createPinia());
app.use(router);

app.mount('#app');
