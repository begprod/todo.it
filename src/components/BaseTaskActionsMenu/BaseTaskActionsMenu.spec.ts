import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import {
  DocumentDuplicateIcon,
  DocumentCheckIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/vue/24/outline';
import { useCommonStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';

describe('BaseTaskActionsMenu', () => {
  const wrapper = mount(BaseTaskActionsMenu, {
    global: {
      components: {
        BasePopup,
        BaseButton,
        DocumentDuplicateIcon,
        DocumentCheckIcon,
        TrashIcon,
        ArrowUturnLeftIcon,
      },
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  const commonStore = useCommonStore();
  const { currentEditingTask, isActionMenuOpen } = storeToRefs(commonStore);

  isActionMenuOpen.value = true;

  it('should update copies counter', async () => {
    currentEditingTask.value = {
      id: '1',
      title: 'test',
      description: 'test',
      isDone: false,
      dayId: 'backlog',
    };

    await wrapper.findAll('button')[0].trigger('click');
    await wrapper.findAll('button')[0].trigger('click');
    await wrapper.findAll('button')[0].trigger('click');

    expect(wrapper.html()).toContain('(3)');

    currentEditingTask.value = null;
  });

  it('should show move to backlog button', async () => {
    currentEditingTask.value = {
      id: '1',
      title: 'test',
      description: 'test',
      isDone: false,
      dayId: '0909999',
    };

    expect(wrapper.html()).toContain('Move to backlog');
  });

  it('should show delete confirmation', async () => {
    await wrapper.findAll('button')[3].trigger('click');

    expect(wrapper.html()).toContain('Confirm deletion');
  });

  it('should have icons component', () => {
    expect(wrapper.findComponent(DocumentDuplicateIcon).exists()).toBe(true);
    expect(wrapper.findComponent(DocumentCheckIcon).exists()).toBe(true);
    expect(wrapper.findComponent(TrashIcon).exists()).toBe(true);
    expect(wrapper.findComponent(ArrowUturnLeftIcon).exists()).toBe(true);
  });
});
