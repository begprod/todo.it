import { storeToRefs } from 'pinia';
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { Trash2 } from 'lucide-vue-next';
import { useCommonStore, useLabelsStore } from '@/stores';
import BasePopup from '@/components/ui/BasePopup/BasePopup.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseLabelActionsMenu from '@/components/BaseLabelActionsMenu/BaseLabelActionsMenu.vue';

describe('BaseLabelActionsMenu', () => {
  const wrapper = mount(BaseLabelActionsMenu, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  const labelsStore = useLabelsStore();
  const commonStore = useCommonStore();
  const { isLabelActionMenuOpen } = storeToRefs(commonStore);
  const { labels } = storeToRefs(labelsStore);

  labels.value = [
    {
      id: '1',
      name: 'test',
      color: '#000000',
      scopeTitle: 'Scope 1',
    },
  ];

  isLabelActionMenuOpen.value = true;

  it('should contain BasePopup component', () => {
    expect(wrapper.findComponent(BasePopup).exists()).toBe(true);
  });

  it('should contain BaseButton component', () => {
    expect(wrapper.findComponent(BaseButton).exists()).toBe(true);
  });

  it('should have icons component', () => {
    expect(wrapper.findComponent(Trash2).exists()).toBe(true);
  });

  it('should show delete confirmation', async () => {
    const deleteLabelButton = wrapper.find('[title="Delete"]');

    await deleteLabelButton.trigger('click');

    expect(wrapper.html()).toContain('Confirm deletion');
  });

  it('should delete label', async () => {
    const deleteItem = vi.spyOn(wrapper.vm, 'remove');
    const confirmDeleteButton = wrapper.find('[title="Confirm deletion"]');

    await confirmDeleteButton.trigger('click');

    expect(deleteItem).toHaveBeenCalled();
  });
});
