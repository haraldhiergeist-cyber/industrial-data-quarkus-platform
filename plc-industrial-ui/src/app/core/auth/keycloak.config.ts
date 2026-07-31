// src/app/core/auth/keycloak.config.ts

import { environment } from '../../../environments/environment';

export const keycloakConfig = {
  url: environment.keycloak.url,
  realm: environment.keycloak.realm,
  clientId: environment.keycloak.clientId
};