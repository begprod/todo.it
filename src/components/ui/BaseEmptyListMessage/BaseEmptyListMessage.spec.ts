import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { MdCancelOutlined } from 'oh-vue-icons/icons';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';

addIcons(MdCancelOutlined);

describe('BaseEmptyListMessage', () => {
  const wrapper = mount(BaseEmptyListMessage, {
    props: {
      message: 'test message',
    },
    global: {
      components: {
        'v-icon': OhVueIcon,
      },
    },
  });

  it('correctly set message props', () => {
    expect(wrapper.html()).toContain('test message');
  });

  it('correctly render icon', () => {
    expect(wrapper.find('svg').classes()).toContain('ov-icon');
  });
});
