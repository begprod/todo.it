import type { ComponentWrapperType } from '@/types';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseLabel from '@/components/ui/BaseLabel/BaseLabel.vue';

describe('BaseLabel', () => {
  let wrapper: ComponentWrapperType<typeof BaseLabel>;

  const createComponent = () => {
    wrapper = mount(BaseLabel, {
      props: {
        title: 'test',
        color: '#ffeeff',
        scopeTitle: null,
      },
    });
  };

  beforeEach(() => {
    createComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should contain the correct props', () => {
    expect(wrapper.props().title).toBe('test');
    expect(wrapper.props().color).toBe('#ffeeff');
  });

  it('should render label text', async () => {
    const label = wrapper.find('[data-test-id="label"]');

    expect(label.text()).toBe('test');
  });

  it('should render scope title', async () => {
    await wrapper.setProps({ scopeTitle: 'test-scope' });

    const scopeTitle = wrapper.find('[data-test-id="scope-title"]');

    expect(scopeTitle.text()).toBe('test-scope');
  });

  it('should add css classes if label has scope title', async () => {
    await wrapper.setProps({ scopeTitle: 'test-scope' });

    const label = wrapper.find('[data-test-id="label"]');

    expect(label.html()).toContain('!rounded-l-none !text-slate-800 bg-none border-2');
  });

  it('should add styles if label has scope title', async () => {
    await wrapper.setProps({ scopeTitle: 'test-scope' });

    const label = wrapper.find('[data-test-id="label"]');

    expect(label.html()).toContain('background-color: rgb(255, 238, 255); border-color: #ffeeff;');
  });

  it('should render without scope title', async () => {
    const scopeTitle = wrapper.find('[data-test-id="scope-title"]');

    expect(scopeTitle.exists()).toBe(false);
  });
});
