import { nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useCommonStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseFilterSearch from '@/components/BaseFilterSearch/BaseFilterSearch.vue';
import BaseTaskLabelMenu from '@/components/BaseTaskLabelMenu/BaseTaskLabelMenu.vue';

describe('BaseTaskLabelMenu', () => {
  const wrapper = mount(BaseTaskLabelMenu, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  const commonStore = useCommonStore();
  const { currentEditingTask, isTaskLabelMenuOpen } = storeToRefs(commonStore);

  currentEditingTask.value = {
    id: '1',
    description: 'test',
    isDone: false,
    dayId: 'backlog',
    labels: [
      {
        id: '1',
        name: 'test',
        color: '#ffeeff',
        scopeTitle: 'Scope 1',
      },
    ],
  };

  it('should contain BasePopup component', () => {
    expect(wrapper.findComponent(BasePopup).exists()).toBe(true);
  });

  it('should contain BaseFilterSearch component', async () => {
    isTaskLabelMenuOpen.value = true;

    await nextTick();

    expect(wrapper.findComponent(BaseFilterSearch).exists()).toBe(true);
  });

  it('should render label list', async () => {
    isTaskLabelMenuOpen.value = true;

    const labelList = wrapper.find('[data-test-id="labels-list"]');

    await nextTick();

    expect(labelList.html()).toContain('Scope 1');
    expect(labelList.html()).toContain('test');
  });
});
