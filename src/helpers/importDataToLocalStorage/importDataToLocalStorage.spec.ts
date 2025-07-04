import type { Mock } from 'vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { importDataToLocalStorage } from './importDataToLocalStorage';

describe('importDataToLocalStorage', () => {
  const mockData = {
    key1: [1, 2, 3],
    key2: { test: true },
    key3: [],
  };

  const mockFileContent = JSON.stringify(mockData);
  const mockFile = new File([mockFileContent], 'backup.json', { type: 'application/json' });

  let originalFileReader: typeof FileReader;
  let mockFileReader: {
    readAsText: Mock;
    // eslint-disable-next-line no-unused-vars
    onload: ((event: ProgressEvent<FileReader>) => void) | null;
    onerror: (() => void) | null;
  };
  let mockInputElement: HTMLInputElement;
  let mockSetItem: Mock;

  beforeEach(() => {
    mockFileReader = {
      readAsText: vi.fn(),
      onload: null,
      onerror: null,
    };

    originalFileReader = global.FileReader;
    global.FileReader = vi.fn(() => mockFileReader) as unknown as typeof FileReader;

    mockInputElement = document.createElement('input');
    document.createElement = vi.fn().mockReturnValue(mockInputElement);

    mockSetItem = vi.fn();
    Object.defineProperty(global, 'localStorage', {
      value: { setItem: mockSetItem },
      writable: true,
    });
  });

  afterEach(() => {
    global.FileReader = originalFileReader;
    vi.restoreAllMocks();
  });

  it('should import JSON and set each key to localStorage', async () => {
    setTimeout(() => {
      Object.defineProperty(mockInputElement, 'files', { value: [mockFile] });
      mockInputElement.dispatchEvent(new Event('change'));
    }, 0);

    setTimeout(() => {
      mockFileReader.onload?.({
        target: { result: mockFileContent } as FileReader,
      } as ProgressEvent<FileReader>);
    }, 0);

    await importDataToLocalStorage();

    expect(mockSetItem).toHaveBeenCalledTimes(3);
    expect(mockSetItem).toHaveBeenCalledWith('key1', JSON.stringify(mockData.key1));
    expect(mockSetItem).toHaveBeenCalledWith('key2', JSON.stringify(mockData.key2));
    expect(mockSetItem).toHaveBeenCalledWith('key3', JSON.stringify(mockData.key3));
  });
});
