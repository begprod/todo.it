import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportDataFromLocalStorage } from './exportDataFromLocalStorage';

describe('exportDataFromLocalStorage', () => {
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    } as unknown as Storage;

    global.URL.createObjectURL = vi.fn().mockReturnValue('mock-url');
    global.URL.revokeObjectURL = vi.fn();

    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return mockLink;
      }
      return document.createElement(tagName);
    });

    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should export multiple items from localStorage into a single JSON file', () => {
    const mockItems = {
      key1: JSON.stringify([1, 2, 3]),
      key2: JSON.stringify({ a: 'b' }),
      key3: JSON.stringify([]),
    };

    // @ts-ignore
    localStorage.getItem = vi.fn((key: string) => mockItems[key]);

    exportDataFromLocalStorage(['key1', 'key2', 'key3']);

    expect(localStorage.getItem).toHaveBeenCalledWith('key1');
    expect(localStorage.getItem).toHaveBeenCalledWith('key2');
    expect(localStorage.getItem).toHaveBeenCalledWith('key3');
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(mockLink.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('should not export anything if no keys return data', () => {
    // @ts-ignore
    localStorage.getItem = vi.fn(() => null);

    exportDataFromLocalStorage(['key1', 'key2']);

    expect(localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(mockLink.click).not.toHaveBeenCalled();
    expect(document.body.appendChild).not.toHaveBeenCalled();
    expect(document.body.removeChild).not.toHaveBeenCalled();
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  });
});
