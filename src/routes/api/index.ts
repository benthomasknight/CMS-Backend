var express = require('express');
var bodyParser = require('body-parser');

function route() {
  var router = new express.Router();
  router.use(bodyParser());

  return router;
}

module.exports = route;