import { Router } from 'express';
import { json } from 'body-parser';
import { info } from 'winston';
import { loginRoute } from './login';
import { logoutRoute } from './logout';
import { createRoute } from './create';

var router = Router();
router.use(json());

// Child Routes
router.use('/login',loginRoute);
router.use('/logout',logoutRoute);
router.use('/create',createRoute);

export let securityRoute = router;
