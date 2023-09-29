#!/usr/bin/env node

import qs from './quickstart-next.js';

(async () => {
  const err = await qs();
  if (err)
    exit(1)
})();
