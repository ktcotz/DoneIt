export class Storage<T extends string | unknown[]> {
  saveToStorage(key: string, value: T) {
    if (Array.isArray(value)) {
      return localStorage.setItem(key, JSON.stringify(value));
    }

    localStorage.setItem(key, value);
  }

  getFromStorage(key: string) {
    const storagedValue = localStorage.getItem(key);

    if (!storagedValue) {
      return null;
    }

    return Array.isArray(storagedValue)
      ? JSON.parse(storagedValue)
      : storagedValue;
  }
}
