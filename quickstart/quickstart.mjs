#!/usr/bin/env node

import quickstart from './quickstart.js';

(async () => {
  const client_id = await quickstart();
  console.log({ client_id });
})();
