import { Router } from 'express';
import { json } from 'body-parser';
import { info } from 'winston';

import {authenticate} from 'passport';
import { db } from '../../../database';
import {IUserModel} from '../../../database/models/user';

var router = Router();
router.use(json());

// Routes
router.post('/', function (req, res) {
  let sq = db.getSequelize();

  (<IUserModel>sq.models.users).UserExists(req.body.username)
  .then((exists):any => {
    if(exists) {
      res.send({
        error: "Username already exists"
      });
      return false;
    }
    return (<IUserModel>sq.models.users).CreateUser(req.body);
  }).then(user => {
    if(user) {
      res.send({
        error: null,
        result: {
          username: user.username
        }
      });
    }
  })
  .catch(err => {
    res.send({
      error: "Unknown Error"
    })
  })
})

export let createRoute = router;
