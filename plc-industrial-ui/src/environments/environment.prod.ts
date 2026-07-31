export const environment = {
  production: true,
  apiBasePath: 'https://plc-query-quarkus.cluster.lab',
  keycloak: {
    url: 'https://keycloak.cluster.lab',
    realm: 'industrial',
    clientId: 'plc-industrial-ui'
  }
};
