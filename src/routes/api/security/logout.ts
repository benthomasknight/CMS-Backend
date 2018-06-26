import { Router } from 'express';
import { json } from 'body-parser';
import { info } from 'winston';

var router = Router();
router.use(json());

// Routes
router.get('/', function (req, res) {
  info('Hit the logout route');
  res.send('Logout');
})

export let logoutRoute = router;