import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { MdCopyallRound, MdDeleteoutline, MdDone, MdMoveupRound } from 'oh-vue-icons/icons';
import { useCommonStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskActionsMenu from '@/components/BaseTaskActionsMenu/BaseTaskActionsMenu.vue';

addIcons(MdCopyallRound, MdDeleteoutline, MdDone, MdMoveupRound);

describe('BaseTaskActionsMenu', () => {
  const wrapper = mount(BaseTaskActionsMenu, {
    global: {
      components: {
        BasePopup,
        BaseButton,
        'v-icon': OhVueIcon,
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

  it('correctly update copies counter', async () => {
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

  it('correctly show move to backlog button', async () => {
    currentEditingTask.value = {
      id: '1',
      title: 'test',
      description: 'test',
      isDone: false,
      dayId: '0909999',
    };

    expect(wrapper.html()).toContain('Move to backlog');
  });
  it('correctly show delete confirmation', async () => {
    await wrapper.findAll('button')[3].trigger('click');

    expect(wrapper.html()).toContain('Confirm deletion');
  });
});
