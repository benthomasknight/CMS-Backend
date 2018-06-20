import { Express } from 'express';
import { routes } from './routes';

export function Instance(app: Express) {
  app.use('/', routes);
}