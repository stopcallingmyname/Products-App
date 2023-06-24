import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving to localStorage', err);
    }
  }

  get(key: string): any {
    try {
      return JSON.parse(localStorage.getItem(key) ?? 'null');
    } catch (err) {
      console.error('Error getting data from localStorage', err);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Error removing data from localStorage', err);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Error clearing localStorage', err);
    }
  }
}
