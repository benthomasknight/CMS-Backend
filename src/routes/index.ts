import { Router } from 'express';
import { json } from 'body-parser';
import { info } from 'winston';

import { apiRoute } from './api';

var router = Router();
router.use(json());

// Child Routes
router.use('/api', apiRoute);

// Routes
router.get('/', (req, res) => {
  info('Hit the base routes getter');
  res.send('Routes Homepage');
});

export let routes = router;