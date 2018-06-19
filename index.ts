import * as bodyParser from 'body-parser';
import * as cluster from 'cluster';
import express from 'express';
import { cpus } from 'os';
import { dirname } from 'path';

import { Instance } from './src';
import { startup } from './src/startup';

var port = 3000;
var root = dirname(__dirname);
var cCPUs = cpus().length;

if (cluster.isMaster && process.env.NODE_ENV != 'development') {
  startup().then(res => {
    if(!res) {
      console.log("CRASHED: Startup Validation Failed.");
      process.exit();
    }

    // Create a worker for each CPU
    for (var i = 0; i < cCPUs; i++) {
      createWorker();
    }
  });
} else {
  var app = express();
  var instance = Instance(app);

  app.use(bodyParser.json());

  app.listen(port, () => {
    console.log('Listening on cluster: ' + process.pid);
  });
}

function createWorker() {
  let worker = cluster.fork();

  worker.on('online', function() {
    console.log(worker.process.pid + ': Worker is online.');
  });

  worker.on('exit', function() {
    console.log(worker.process.pid + ': Worker died.');
    console.log(worker.process.pid + ': Restarting worker');
    createWorker();
  });
}
