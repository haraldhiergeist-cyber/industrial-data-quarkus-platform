import { Injectable, signal } from '@angular/core';

export type AppLanguage = 'de' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'app.language';
  private readonly DEFAULT_LANGUAGE: AppLanguage = 'de';

  private readonly _language = signal<AppLanguage>(this.resolveInitialLanguage());

  readonly language = this._language.asReadonly();

  setLanguage(language: AppLanguage): void {
    this._language.set(language);
    localStorage.setItem(this.STORAGE_KEY, language);
    document.documentElement.lang = language;
  }

  getCurrentLanguage(): AppLanguage {
    return this._language();
  }

  private resolveInitialLanguage(): AppLanguage {
    const stored = localStorage.getItem(this.STORAGE_KEY) as AppLanguage | null;
    if (stored === 'de' || stored === 'en') {
      document.documentElement.lang = stored;
      return stored;
    }

    document.documentElement.lang = this.DEFAULT_LANGUAGE;
    return this.DEFAULT_LANGUAGE;
  }
}