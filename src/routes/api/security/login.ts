import { Router } from 'express';
import { json } from 'body-parser';
import { info } from 'winston';

import {authenticate} from 'passport';

var router = Router();
router.use(json());

// Routes
router.post('/', authenticate('local'), function (req, res) {
  res.send('Successfully Logged In');
})

export let loginRoute = router;