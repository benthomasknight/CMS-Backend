import { Router } from 'express';
import { json } from 'body-parser';
import { info } from 'winston';

import {dbv1Route} from './v1';

var router = Router();
router.use(json());

// Child Routes
router.use('/v1', dbv1Route);

// Routes
router.get('/', function (req, res) {
  info('Hit the api/db route');
  res.send('api/db Homepage');
})

export let dbRoute = router;