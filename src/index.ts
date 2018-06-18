import { Express } from 'express';
import { routes } from './routes';
import { db } from './database';

export function Instance(app: Express) {
  app.use('/', routes);
  db.test();
}