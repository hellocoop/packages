// identifier.js

// identifierTypesSet added by build script

let generateId;

const HELLO_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
// Load nanoid dynamically
const loadNanoid = async () => {
  const { customAlphabet } = await import('nanoid');
  generateId = customAlphabet(HELLO_ALPHABET, 24);
};

loadNanoid(); // Call the function to load nanoid immediately

const HELLO_REGEX = new RegExp(`^[${HELLO_ALPHABET}]+$`);

const checksum = (prefix, id) => {
  const pb = Buffer.from(prefix);
  const dib = Buffer.from(id);
  const a = pb[0] + dib[0] + dib[3] + dib[7] + dib[10] + dib[14] + dib[17] + dib[21];
  const b = pb[1] + dib[1] + dib[4] + dib[8] + dib[11] + dib[15] + dib[18] + dib[22];
  const c = pb[2] + dib[2] + dib[5] + dib[9] + dib[12] + dib[16] + dib[19] + dib[23];
  return HELLO_ALPHABET[a % 62] + HELLO_ALPHABET[b % 62] + HELLO_ALPHABET[c % 62];
};

const validate = (identifier) => {
  const parts = identifier.split('_');
  if (parts.length !== 3) {
    return false; // Invalid format
  }

  const [prefix, id, providedChecksum] = parts;

  if (!identifierTypesSet.has(prefix)) {
    return false; // Unknown prefix
  }

  if (id.length !== 24 || providedChecksum.length !== 3) {
    return false; // Invalid length
  }

  if (!HELLO_REGEX.test(id) || !HELLO_REGEX.test(providedChecksum)) {
    return false; // Invalid parts
  }

  const calculatedChecksum = checksum(prefix, id);

  return providedChecksum === calculatedChecksum;
};

const nano_id = (prefix) => {
  if (!generateId) {
    throw new Error("nanoid is not ready. Ensure that loadNanoid has been called and completed.");
  }
  const id = generateId();
  return `${prefix}_${id}_${checksum(prefix, id)}`;
};

const generators = identifierTypes.reduce((acc, type) => {
  acc[type] = () => nano_id(type);
  return acc;
}, {});

generators.validate = validate;

/*
 * export and modules.exports statements added by build script
 */