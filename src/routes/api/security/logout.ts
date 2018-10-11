import { Router } from 'express';
import { json } from 'body-parser';
import { info } from 'winston';

var router = Router();
router.use(json());

// Routes
router.get('/', function (req, res) {
  req.logout();
  info('Hit the logout route');
  res.redirect('/');
})

export let logoutRoute = router;
