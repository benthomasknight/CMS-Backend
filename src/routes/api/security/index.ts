import { Router } from 'express';
import { json } from 'body-parser';
import { info } from 'winston';
import { loginRoute } from './login';
import { logoutRoute } from './logout';

var router = Router();
router.use(json());

// Child Routes
router.use('/login',loginRoute);
router.use('/logout',logoutRoute)

export let securityRoute = router;