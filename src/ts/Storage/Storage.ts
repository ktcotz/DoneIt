export class Storage<T extends string | unknown[]> {
  saveToStorage(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getFromStorage(key: string) {
    const storageValue = localStorage.getItem(key);

    if (!storageValue) return null;

    return JSON.parse(storageValue) as T;
  }
}
