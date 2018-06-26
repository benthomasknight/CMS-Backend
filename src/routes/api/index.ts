import { Router } from 'express';
import { json } from 'body-parser';
import { info } from 'winston';

import { dbRoute } from './db';
import { securityRoute } from './security';

var router = Router();
router.use(json());

// Child Routes
router.use('/db', dbRoute);

// Routes
router.use('/', securityRoute);

router.get('/', function (req, res) {
  info('Hit the base api route');
  res.send('API Homepage');
})

export let apiRoute = router;