export class LocalStorageService {
  constructor(private readonly keyPrefix = "quizApp") {}

  getItem(key: string): string | null {
    return this.getStorage()?.getItem(this.buildKey(key)) ?? null;
  }

  setItem(key: string, value: string): void {
    this.getStorage()?.setItem(this.buildKey(key), value);
  }

  removeItem(key: string): void {
    this.getStorage()?.removeItem(this.buildKey(key));
  }

  clear(keys: readonly string[]): void {
    keys.forEach((key) => this.removeItem(key));
  }

  private buildKey(key: string): string {
    return `${this.keyPrefix}:${key}`;
  }

  private getStorage(): Storage | null {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage;
  }
}
