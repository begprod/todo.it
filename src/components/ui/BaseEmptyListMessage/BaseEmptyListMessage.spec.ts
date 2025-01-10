import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { CaptionsOff } from 'lucide-vue-next';
import BaseEmptyListMessage from '@/components/ui/BaseEmptyListMessage/BaseEmptyListMessage.vue';

describe('BaseEmptyListMessage', () => {
  const wrapper = mount(BaseEmptyListMessage, {
    props: {
      message: 'test message',
    },
    global: {
      components: {
        CaptionsOff,
      },
    },
  });

  it('should set message props', () => {
    expect(wrapper.html()).toContain('test message');
  });

  it('should have icon component', () => {
    expect(wrapper.findComponent(CaptionsOff).exists()).toBe(true);
  });
});
