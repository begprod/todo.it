import { afterEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { useProjectsStore } from '@/stores/projects/projects';
import type { IProject } from '@/types';

describe('useProjectsStore', () => {
  afterEach(() => {
    setActivePinia(undefined);
  });

  it('should start with an empty project list', () => {
    setActivePinia(createPinia());

    const { projects } = storeToRefs(useProjectsStore());

    expect(projects.value).toEqual([]);
  });

  it('should add projects in creation order', () => {
    setActivePinia(createPinia());
    const store = useProjectsStore();
    const first: IProject = {
      id: 'first',
      title: 'First',
      color: '#000000',
      priority: 1,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    };
    const second: IProject = { ...first, id: 'second', title: 'Second' };

    store.createProject(first);
    store.createProject(second);

    expect(store.projects).toEqual([first, second]);
  });
});
