import * as cluster from 'cluster';
import express from 'express';
import { cpus } from 'os';
import { dirname } from 'path';

import { Instance } from './src';
import { startup } from './src/startup';

import DailyRotateFile from 'winston-daily-rotate-file';
import * as logger from 'winston';

logger.add(new logger.transports.Console({format: logger.format.colorize()}));


var port = 3000;
var root = dirname(__dirname);
var cCPUs = cpus().length;


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
      logger.info('Listening on cluster: ' + process.pid);
    });
  }
} else {
  logger.add(new DailyRotateFile({
    filename: `${process.pid}-%DATE%.log`,
    dirname: 'logs',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d'
  }));

  var app = express();
  var instance = Instance(app);

  app.listen(port, () => {
    logger.info('Listening on cluster: ' + process.pid);
  });
}

function createWorker() {
  let worker = cluster.fork();

  worker.on('online', function() {
    logger.info(worker.process.pid + ': Worker is online.');
  });

  worker.on('exit', function() {
    logger.error(worker.process.pid + ': Worker died.');
    logger.error(worker.process.pid + ': Restarting worker');
    createWorker();
  });
}
