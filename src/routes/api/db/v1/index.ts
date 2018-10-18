import { Router } from 'express';
import { json } from 'body-parser';
import {info, error} from 'winston';
import { db } from '../../../../database';
import { QueryHelper } from './QueryHelper';
import { FindOptions } from 'sequelize';

var router = Router();
router.use(json());

/*
  GET ROUTES
*/
router.get('/', function (req, res) {
  res.sendStatus(400);
  res.send("A Table Name must be provided.");
});


router.get('/:table', function (req, res) {
  let sq = db.getSequelize();

  if(!sq.models[req.params.table]) {
    res.sendStatus(400);
    res.send("An invalid table name was provided.");
    return;
  }

  // Valid Parameters
  var q = QueryHelper.getQueryParameters(req.query);
  var query:FindOptions<any> = {};

  if(q.columns) {
    query.attributes = q.columns;
  }
  if(q.query) {
    query.where = q.query;
  }

  sq.models[req.params.table].findAll(query)
  .then((v) => {
    // Return the result as JSON
    res.json(v);
  }).catch(err => {
    error(err);
    res.send("Failed to retrieve data. Please check your query.");
  });
});

router.get('/:table/:id', function (req, res) {
  info('Hit the api/db/v1 route');
  res.send('api/db/v1 Homepage');
});


/*
  POST ROUTES
*/
router.post('/', function (req, res) {
  res.sendStatus(400);
  res.send("A Table Name must be provided.");
});

router.post('/:table', function (req, res) {
  let sq = db.getSequelize();

  if(!sq.models[req.params.table]) {
    res.sendStatus(400);
    res.send("An invalid table name was provided.");
    return;
  }

  // Insert Payload
  // Validation is done before insert on the model so none is done here
  sq.models[req.params.table].create(req.body)
  .then(record => {

  }).catch(err => {
    error(err);
  })

  res.send("success");
});

export let dbv1Route = router;
