import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';

describe('BaseSettings', () => {
  const wrapper = mount(BaseSettings);

  it('should contain settings title', () => {
    expect(wrapper.html()).toContain('Settings');
  });
});
