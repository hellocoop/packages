// identifierTypes.js -- only used during build
// edit this file to add new identifier types

const identifierTypeDescriptions = {
  // Wallet created
  usr: 'Hellō internal user identifier',
  hdi: 'Hellō directed identifier - sub value in ID token',
  jti: 'ID Token jti',
  kid: 'Hellō key identifier in ID Token header',
  ses: 'Hellō session identifier',
  dvc: 'Hellō device cookie identifier',
  inv: 'Hellō invitation identifier',
  pky: 'Hellō passkey identifier',
  pic: 'Hellō picture identifier',
  non: 'Hellō nonce identifier',
  cod: "Hellō authorization code",
  // Admin created
  pub: 'Hellō publisher identifier',
  app: 'Hellō application identifier'
};

const identifierTypesSet = new Set(Object.keys(identifierTypeDescriptions));

if (Object.keys(identifierTypeDescriptions).length !== identifierTypesSet.size) {
  throw new Error("Mismatch between identifierTypeDescriptions keys and identifierTypesSet size.");
}

export { identifierTypesSet, identifierTypeDescriptions };