import { Router } from 'express';
import { json } from 'body-parser';

var router = Router();
router.use(json());

// Routes
router.get('/', function (req, res) {
  res.send('API Homepage');
})

export let apiRoute = router;