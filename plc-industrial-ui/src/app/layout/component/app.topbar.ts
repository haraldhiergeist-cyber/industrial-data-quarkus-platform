import { Component, ViewChild, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { MenuModule } from 'primeng/menu';

import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { LanguageService, AppLanguage } from '@/app/core/i18n/language.service';
import { TranslationService } from '@/app/core/i18n/translation.service';
import { AuthService } from '@/app/core/auth/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, MenuModule, AppConfigurator],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo" routerLink="/">
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-cog text-2xl text-primary"></i>
                        <span class="font-bold text-xl">PLC Industrial UI</span>
                    </div>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                        <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                    </button>

                    <div class="relative">
                        <button
                            type="button"
                            class="layout-topbar-action"
                            (click)="toggleLanguageMenu($event)"
                            aria-label="Change language"
                        >
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-globe"></i>
                                <span class="hidden sm:inline font-medium">{{ currentLanguage.toUpperCase() }}</span>
                            </div>
                        </button>

                        <p-menu #languageMenu [model]="languageItems" [popup]="true" appendTo="body"></p-menu>
                    </div>

                    <div class="relative">
                        <button
                            class="layout-topbar-action layout-topbar-action-highlight"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-palette"></i>
                        </button>
                        <app-configurator />
                    </div>
                </div>

                <button
                    class="layout-topbar-menu-button layout-topbar-action"
                    pStyleClass="@next"
                    enterFromClass="hidden"
                    enterActiveClass="animate-scalein"
                    leaveToClass="hidden"
                    leaveActiveClass="animate-fadeout"
                    [hideOnOutsideClick]="true"
                >
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <button type="button" class="layout-topbar-action">
                            <i class="pi pi-calendar"></i>
                            <span>Calendar</span>
                        </button>
                        <button type="button" class="layout-topbar-action">
                            <i class="pi pi-inbox"></i>
                            <span>Messages</span>
                        </button>
                       <button type="button" class="layout-topbar-action" (click)="onUserClick()">
                            <i class="pi pi-user"></i>
                            <span>{{ authService.authenticated() ? authService.username() : 'Login' }}</span>
                        </button>

                        @if (authService.authenticated()) {
                            <button type="button" class="layout-topbar-action" (click)="logout()">
                                <i class="pi pi-sign-out"></i>
                                <span>Logout</span>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppTopbar {
    @ViewChild('languageMenu') languageMenu!: Menu;

    layoutService = inject(LayoutService);
    languageService = inject(LanguageService);
    translationService = inject(TranslationService);
    authService = inject(AuthService);

    languageItems: MenuItem[] = [];

    ngOnInit(): void {
        this.buildLanguageItems();
    }

    get currentLanguage(): AppLanguage {
        return this.languageService.getCurrentLanguage();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    toggleLanguageMenu(event: Event): void {
        this.languageMenu.toggle(event);
    }

    async setLanguage(language: AppLanguage): Promise<void> {
        await this.translationService.changeLanguage(language);
        this.buildLanguageItems();
    }

   async onUserClick(): Promise<void> {
        if (!this.authService.authenticated()) {
            await this.authService.loginTo('/');
        }
    }

    async logout(): Promise<void> {
        await this.authService.logout();
    }

    private buildLanguageItems(): void {
        const current = this.languageService.getCurrentLanguage();

        this.languageItems = [
            {
                label: '🇩🇪 Deutsch',
                icon: current === 'de' ? 'pi pi-check' : '',
                command: () => this.setLanguage('de')
            },
            {
                label: '🇬🇧 English',
                icon: current === 'en' ? 'pi pi-check' : '',
                command: () => this.setLanguage('en')
            }
        ];
    }
}
