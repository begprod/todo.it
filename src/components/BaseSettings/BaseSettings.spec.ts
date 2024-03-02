import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { useCommonStore } from '@/stores';
import BaseSettings from '@/components/BaseSettings/BaseSettings.vue';

describe('BaseSettings', () => {
  const wrapper = mount(BaseSettings, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  const commonStore = useCommonStore();
  const { isSettingsOpen } = storeToRefs(commonStore);

  isSettingsOpen.value = true;

  it('should contain settings title', () => {
    expect(wrapper.html()).toContain('Settings');
  });
});
