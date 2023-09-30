#!/usr/bin/env node

import qs from './index.js';

(async () => {
  const client_id = await qs();
  console.log({ client_id });
})();
