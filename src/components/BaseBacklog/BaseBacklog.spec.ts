import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { Settings, Plus, PanelLeftClose } from 'lucide-vue-next';
import { useCommonStore, useTasksStore } from '@/stores';
import BaseBacklog from '@/components/BaseBacklog/BaseBacklog.vue';
import BaseSidebar from '@/components/ui/BaseSidebar/BaseSidebar.vue';
import BaseLogo from '@/components/layouts/partials/BaseLogo/BaseLogo.vue';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseTaskListBacklog from '@/components/BaseTaskListBacklog/BaseTaskListBacklog.vue';
import BaseFooter from '@/components/layouts/partials/BaseFooter/BaseFooter.vue';

describe('BaseBacklog', () => {
  const wrapper = mount(BaseBacklog, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
    components: {
      BaseSidebar,
      BaseLogo,
      BaseButton,
      BaseTaskListBacklog,
      BaseFooter,
      Settings,
      Plus,
      PanelLeftClose,
    },
  });

  const commonStore = useCommonStore();
  const tasksStore = useTasksStore();
  const { toggleSidebar, toggleSettings } = commonStore;
  const { createTask } = tasksStore;

  it('should contain sidebar', () => {
    expect(wrapper.findComponent(BaseSidebar).exists()).toBe(true);
  });

  it('should contain logo', () => {
    expect(wrapper.findComponent(BaseLogo).exists()).toBe(true);
  });

  it('should contain footer', () => {
    expect(wrapper.findComponent(BaseFooter).exists()).toBe(true);
  });

  it('should contain github image', () => {
    const image = wrapper.find('[data-test-id="github-image"]');

    expect(image.exists()).toBe(true);
  });

  it('should contain toggle settings button', () => {
    const button = wrapper.find('[data-test-id="toggle-settings-button"]');

    expect(button.exists()).toBe(true);
    expect(button.html()).toContain('Collapse/Expand settings sidebar');
    expect(button.findComponent(Settings).exists()).toBe(true);
  });

  it('should contain add to backlog button', async () => {
    const button = wrapper.find('[data-test-id="add-task-to-backlog"]');

    expect(button.exists()).toBe(true);
    expect(button.html()).toContain('Add to backlog');
    expect(button.findComponent(Plus).exists()).toBe(true);
  });

  it('should contain toggle backlog button', () => {
    const button = wrapper.find('[data-test-id="toggle-backlog-button"]');

    expect(button.exists()).toBe(true);
    expect(button.html()).toContain('Collapse backlog sidebar');
    expect(button.findComponent(PanelLeftClose).exists()).toBe(true);
  });

  it('should contain task list', () => {
    expect(wrapper.findComponent(BaseTaskListBacklog).exists()).toBe(true);
  });

  it('should call createTask with backlog id when button is clicked', async () => {
    const button = wrapper.find('[data-test-id="add-task-to-backlog"]');

    await button.trigger('click');

    expect(createTask).toHaveBeenCalled();
  });

  it('should call toggleSidebar when toggle button is clicked', async () => {
    const button = wrapper.find('[data-test-id="toggle-backlog-button"]');

    await button.trigger('click');

    expect(toggleSidebar).toHaveBeenCalled();
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });

  it('should call toggleSettings when toggle button is clicked', async () => {
    const button = wrapper.find('[data-test-id="toggle-settings-button"]');

    await button.trigger('click');

    expect(toggleSettings).toHaveBeenCalled();
    expect(toggleSettings).toHaveBeenCalledTimes(1);
  });
});
