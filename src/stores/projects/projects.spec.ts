import { describe, expect, it } from 'vitest';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { useProjectsStore } from '@/stores/projects/projects';
import type { IProject } from '@/types';

describe('useProjectsStore', () => {
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

  it('should update an existing project by id', () => {
    setActivePinia(createPinia());

    const store = useProjectsStore();
    const project: IProject = {
      id: 'project',
      title: 'Original title',
      color: '#000000',
      priority: 1,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    };
    const updatedProject: IProject = {
      ...project,
      title: 'Updated title',
      color: '#abcdef',
      priority: 4,
      updatedAt: '2026-11-07T00:00:00.000Z',
    };

    store.createProject(project);
    store.updateProject(updatedProject);

    expect(store.projects).toEqual([updatedProject]);
  });

  it('should not update projects when id is unknown', () => {
    setActivePinia(createPinia());

    const store = useProjectsStore();
    const project: IProject = {
      id: 'project',
      title: 'Original title',
      color: '#000000',
      priority: 1,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    };
    const unknownProject: IProject = { ...project, id: 'unknown' };

    store.createProject(project);
    store.updateProject(unknownProject);

    expect(store.projects).toEqual([project]);
  });

  it('should delete an existing project by id', () => {
    setActivePinia(createPinia());

    const store = useProjectsStore();
    const project: IProject = {
      id: 'project',
      title: 'Project',
      color: '#000000',
      priority: 1,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    };
    const otherProject: IProject = { ...project, id: 'other-project' };

    store.createProject(project);
    store.createProject(otherProject);
    store.deleteProject(project.id);

    expect(store.projects).toEqual([otherProject]);
  });

  it('should not delete projects when id is unknown', () => {
    setActivePinia(createPinia());

    const store = useProjectsStore();
    const project: IProject = {
      id: 'project',
      title: 'Project',
      color: '#000000',
      priority: 1,
      createdAt: '2026-11-06T00:00:00.000Z',
      updatedAt: '2026-11-06T00:00:00.000Z',
    };

    store.createProject(project);
    store.deleteProject('unknown');

    expect(store.projects).toEqual([project]);
  });
});
