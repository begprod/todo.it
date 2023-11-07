import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';

describe('BaseEmptyListMessage', () => {
  const wrapper = mount(BaseEmptyListMessage, {
    props: {
      message: 'test message',
    },
    global: {
      components: {
        XCircleIcon,
      },
    },
  });

  it('should set message props', () => {
    expect(wrapper.html()).toContain('test message');
  });

  it('should have icon component', () => {
    expect(wrapper.findComponent(XCircleIcon).exists()).toBe(true);
  });
});
