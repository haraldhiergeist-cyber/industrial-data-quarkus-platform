import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  transform(key: string): string {
    // wichtig: Signal lesen, damit Angular bei Sprachwechsel neu rendert
    this.translationService.currentLanguage();

    return this.translationService.translate(key);
  }
}