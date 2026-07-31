export const environment = {
  production: false,
  apiBasePath: 'http://localhost:8080',
  keycloak: {
    url: 'https://keycloak.cluster.lab/',
    realm: 'industrial',
    clientId: 'plc-industrial-ui'
  }
};
