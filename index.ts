import * as cluster from 'cluster';
import express from 'express';
import { cpus } from 'os';
import { dirname } from 'path';

import { Instance } from './src';
import { startup } from './src/startup';
//import { logger } from './src/util/log';
import { createLogger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

var port = 3000;
var root = dirname(__dirname);
var cCPUs = cpus().length;
let logger = createLogger({
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: `${process.pid}-%DATE%.log`,
      dirname: 'logs',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d'
    })
  ]
});

if (process.env.NODE_ENV != 'development') {
  if (cluster.isMaster) {

    startup()
      .then(res => {
        if (res) {
          // Create a worker for each CPU
          for (var i = 0; i < cCPUs; i++) {
            createWorker();
          }
        } else {
          logger.error('Startup Validation Failed');
        }
      })
      .catch(err => {
        logger.error('Startup Validation Failed');
        logger.error(err);
      });
  } else {
    var app = express();
    var instance = Instance(app);

    app.listen(port, () => {
      console.log('Listening on cluster: ' + process.pid);
    });
  }
} else {
  var app = express();
  var instance = Instance(app);

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
