#!/usr/bin/env node
import 'dotenv/config'
import qs from './index.js';

const client_id = await qs();
console.log({ client_id });
