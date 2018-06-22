import { Router } from 'express';
import { json } from 'body-parser';
import { info } from 'winston';

import { dbRoute } from './db'

var router = Router();
router.use(json());

// Child Routes
router.use('/db', dbRoute);

// Routes
router.get('/', function (req, res) {
  info('Hit the base api route');
  res.send('API Homepage');
})

export let apiRoute = router;