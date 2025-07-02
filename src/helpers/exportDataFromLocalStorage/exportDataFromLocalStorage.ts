export function exportDataFromLocalStorage(keys: string[]) {
  const exportObject: Record<string, any> = {};

  keys.forEach((key) => {
    const value = localStorage.getItem(key);

    if (value !== null) {
      try {
        exportObject[key] = JSON.parse(value);
      } catch {
        exportObject[key] = value; // если вдруг не JSON, сохраняем как есть
      }
    }
  });

  if (Object.keys(exportObject).length === 0) {
    return;
  }

  const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  link.href = url;
  link.download = `todo.it.backup.${date}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
