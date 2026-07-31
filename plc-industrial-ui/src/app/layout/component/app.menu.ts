import { Component, effect, inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { TranslationService } from '@/app/core/i18n/translation.service';



@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];

    private readonly translationService = inject(TranslationService);

    constructor() {
        effect(() => {
            this.translationService.currentLanguage();
            this.buildMenu();
        });
    }

    private buildMenu(): void {
        this.model = [
            {
                label: this.translationService.translate('menu.home'),
                items: [
                    {
                        label: this.translationService.translate('menu.dashboard'),
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/']
                    },
                    {
                        label: this.translationService.translate('menu.measurements'),
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/measurements']
                    }
                ]
            }
        ];
    }
}