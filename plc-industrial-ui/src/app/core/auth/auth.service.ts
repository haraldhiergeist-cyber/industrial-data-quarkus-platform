import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { keycloakConfig } from './keycloak.config';

export interface AuthDebugInfo {
  reason: string;
  currentUrl: string;
  documentBaseUri: string;
  redirectUrl: string;
  redirectUri: string;
  keycloakUrl: string;
  keycloakRealm: string;
  keycloakClientId: string;
  attemptCount?: number;
  startedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = new Keycloak(keycloakConfig);
  private readonly router = inject(Router);
  private readonly loginAttemptStorageKey = 'loginRedirectAttempt';
  private readonly authDebugStorageKey = 'authDebugInfo';
  private readonly maxLoginAttempts = 2;
  private readonly loginAttemptWindowMs = 60_000;
  private readonly keycloakCallbackParams = new Set([
    'code',
    'state',
    'session_state',
    'iss'
  ]);

  readonly authenticated = signal(false);
  readonly profile = signal<KeycloakProfile | null>(null);

  readonly username = computed(() =>
    this.profile()?.firstName ||
    this.profile()?.username ||
    this.profile()?.email ||
    'User'
  );

  async init(): Promise<void> {
    const loggedIn = await this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      responseMode: 'query',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: this.toAbsoluteRedirectUri('/silent-check-sso.html'),
      silentCheckSsoFallback: false,
      messageReceiveTimeout: 1000
    });

    this.authenticated.set(loggedIn);

    if (loggedIn) {
      this.resetLoginAttempts();
      this.profile.set(await this.keycloak.loadUserProfile());
      this.navigateToRememberedRedirectUrl();
    }
  }

  async login(): Promise<void> {
    await this.keycloak.login({
      redirectUri: this.toAbsoluteRedirectUri('/')
    });
  }

  rememberRedirectUrl(url: string): void {
    sessionStorage.setItem('redirectUrl', this.withoutKeycloakCallbackParams(url));
  }

  async loginTo(url: string): Promise<boolean> {
    this.rememberRedirectUrl(url);

    if (!this.registerLoginAttempt(url)) {
      this.rememberAuthDebugInfo('login-loop-stopped', url);
      return false;
    }

    await this.login();
    return true;
  }

  async logout(): Promise<void> {
    await this.keycloak.logout({
      redirectUri: this.toAbsoluteRedirectUri('/')
    });
  }

  async getToken(): Promise<string | undefined> {
    if (!this.keycloak.authenticated) {
      return undefined;
    }

    await this.keycloak.updateToken(30);
    return this.keycloak.token;
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  getAuthDebugInfo(): AuthDebugInfo | null {
    const rawInfo = sessionStorage.getItem(this.authDebugStorageKey);

    if (!rawInfo) {
      return null;
    }

    try {
      return JSON.parse(rawInfo);
    } catch {
      return null;
    }
  }

  private toAbsoluteRedirectUri(redirectUrl: string): string {
    return new URL(
      this.withoutKeycloakCallbackParams(redirectUrl),
      document.baseURI
    ).toString();
  }

  private withoutKeycloakCallbackParams(url: string): string {
    const redirectUrl = new URL(url, document.baseURI);

    for (const param of this.keycloakCallbackParams) {
      redirectUrl.searchParams.delete(param);
    }

    return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
  }

  private registerLoginAttempt(url: string): boolean {
    const redirectUrl = this.withoutKeycloakCallbackParams(url);
    const now = Date.now();
    const previous = this.readLoginAttempt();
    const attempt =
      previous &&
      previous.redirectUrl === redirectUrl &&
      now - previous.startedAt < this.loginAttemptWindowMs
        ? previous
        : { redirectUrl, count: 0, startedAt: now };

    if (attempt.count >= this.maxLoginAttempts) {
      return false;
    }

    sessionStorage.setItem(
      this.loginAttemptStorageKey,
      JSON.stringify({
        ...attempt,
        count: attempt.count + 1
      })
    );

    return true;
  }

  private rememberAuthDebugInfo(reason: string, url: string): void {
    const redirectUrl = this.withoutKeycloakCallbackParams(url);
    const attempt = this.readLoginAttempt();

    sessionStorage.setItem(
      this.authDebugStorageKey,
      JSON.stringify({
        reason,
        currentUrl: window.location.href,
        documentBaseUri: document.baseURI,
        redirectUrl,
        redirectUri: this.toAbsoluteRedirectUri(redirectUrl),
        keycloakUrl: keycloakConfig.url,
        keycloakRealm: keycloakConfig.realm,
        keycloakClientId: keycloakConfig.clientId,
        attemptCount: attempt?.count,
        startedAt: attempt ? new Date(attempt.startedAt).toISOString() : undefined
      })
    );
  }

  private readLoginAttempt(): {
    redirectUrl: string;
    count: number;
    startedAt: number;
  } | null {
    const rawAttempt = sessionStorage.getItem(this.loginAttemptStorageKey);

    if (!rawAttempt) {
      return null;
    }

    try {
      return JSON.parse(rawAttempt);
    } catch {
      return null;
    }
  }

  private resetLoginAttempts(): void {
    sessionStorage.removeItem(this.loginAttemptStorageKey);
    sessionStorage.removeItem(this.authDebugStorageKey);
  }

  private navigateToRememberedRedirectUrl(): void {
    const redirectUrl = sessionStorage.getItem('redirectUrl');

    if (!redirectUrl || redirectUrl === '/') {
      return;
    }

    sessionStorage.removeItem('redirectUrl');
    queueMicrotask(() => void this.router.navigateByUrl(redirectUrl));
  }
}
