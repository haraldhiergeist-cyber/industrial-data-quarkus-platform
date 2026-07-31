import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppLanguage, LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  private readonly translations = signal<Record<string, any>>({});

  readonly currentLanguage = this.languageService.language;

  async init(): Promise<void> {
    await this.loadTranslations(this.languageService.getCurrentLanguage());
  }

  async changeLanguage(language: AppLanguage): Promise<void> {
    await this.loadTranslations(language);
    this.languageService.setLanguage(language);
  }

  translate(key: string): string {
    const value = key.split('.').reduce((acc: any, part: string) => acc?.[part], this.translations());
    return typeof value === 'string' ? value : key;
  }

  private async loadTranslations(language: AppLanguage): Promise<void> {
    const data = await firstValueFrom(
      this.http.get<Record<string, any>>(`/assets/i18n/${language}.json`)
    );

    this.translations.set(data);
  }
}