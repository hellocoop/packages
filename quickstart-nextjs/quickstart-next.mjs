#!/usr/bin/env node

import qs from './index.js';

(async () => {
  const err = await qs();
  if (err)
    exit(1)
})();
