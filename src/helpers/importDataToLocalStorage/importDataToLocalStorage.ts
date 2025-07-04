export function importDataToLocalStorage(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    fileInput.onchange = function (event: Event) {
      const { files } = event.target as HTMLInputElement;

      if (!files || files.length === 0) {
        return reject(new Error('No files selected'));
      }

      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const { result } = event.target as FileReader;

          if (typeof result !== 'string') {
            return reject(new Error('Invalid file content'));
          }

          const data = JSON.parse(result);

          if (typeof data !== 'object' || data === null) {
            return reject(new Error('JSON must be an object'));
          }

          for (const [key, value] of Object.entries(data)) {
            localStorage.setItem(key, JSON.stringify(value));
          }

          resolve();
        } catch (err) {
          reject(new Error('Failed to parse JSON'));
        }
      };

      reader.onerror = () => reject(new Error('File read error'));

      reader.readAsText(file);
    };

    fileInput.click();
  });
}
