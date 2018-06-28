import * as cluster from 'cluster';
import express, { Request, Response } from 'express';

import { cpus } from 'os';
import { dirname } from 'path';

import { createServer as createServerHTTP } from 'http';
import { createServer as createServerHTTPS } from 'https';

/*
PASSPORT
*/
import {setupSecurity} from './src/startup/security';


import { Instance } from './src';
import { startup } from './src/startup';
import config from 'config';

import DailyRotateFile from 'winston-daily-rotate-file';
import * as logger from 'winston';
import { readFileSync } from 'fs';
import { NextFunction } from 'express-serve-static-core';

logger.add(new logger.transports.Console({format: logger.format.colorize()}));


var port = (config.get('server') as any).port || 443;
var root = dirname(__dirname);
var cCPUs = cpus().length;

// HTTPS Cert options

let cert = (<any>config.get("security")).cert;
var httpsOptions = {
  key: readFileSync(cert.key),
  cert: readFileSync(cert.cert)
};


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
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      if(req.secure){
        // OK, continue
        return next();
      };
      // handle port numbers if you need non defaults
      let path = `https://${req.hostname}:${port}${req.url}`;
      res.redirect(path); // express 4.x
    })

    var instance = Instance(app);

    /*
    HTTPS Server
    */
    createServerHTTPS(httpsOptions, app).listen(port, () => {
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
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    if(req.secure){
      // OK, continue
      return next();
    };
    // handle port numbers if you need non defaults
    let path = `https://${req.hostname}:${port}${req.url}`;
    res.redirect(path); // express 4.x
  })
  setupSecurity(app);

  // Should always be just before the listen call
  var instance = Instance(app);

  /*
  Auto redirect to HTTPS
  */
  createServerHTTP(app).listen(80);

  /*createServerHTTP(app).listen(port, () => {
    logger.info('Listening on cluster: ' + process.pid);
  });*/
  createServerHTTPS(httpsOptions, app).listen(port, () => {
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
