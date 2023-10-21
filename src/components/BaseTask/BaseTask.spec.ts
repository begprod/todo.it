import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { OiGrabber } from 'oh-vue-icons/icons';
import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import BaseButton from '@/components/ui/controls/BaseButton/BaseButton.vue';
import BaseContentEditableInput from '@/components/ui/controls/BaseContentEditableInput/BaseContentEditableInput.vue';
import BaseTask from '@/components/BaseTask/BaseTask.vue';

addIcons(OiGrabber);

describe('BaseTask', () => {
  const wrapper = shallowMount(BaseTask, {
    props: {
      task: {
        id: '123',
        title: 'Test',
        description: 'Test',
        isDone: false,
        dayId: 'backlog',
      },
    },
    global: {
      components: {
        BaseButton,
        BaseContentEditableInput,
        'v-icon': OhVueIcon,
      },
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });

  it('correctly apply css classes when dayId "backlog" and task is not done', () => {
    expect(wrapper.html()).toContain('!bg-zinc-100 !border-gray-300');
  });

  it('correctly apply css classes when task is done', async () => {
    await wrapper.setProps({
      task: {
        id: '123',
        title: 'Test',
        description: 'Test',
        isDone: true,
        dayId: 'backlog',
      },
    });

    expect(wrapper.html()).toContain('!bg-teal-100 !border-teal-200 line-through');
  });
});
