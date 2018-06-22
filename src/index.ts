import { Express } from 'express';
import { routes } from './routes';

/**
 * Instance is the entry way for all instances of the program.
 *
 * @export
 * @param {Express} app
 */
export function Instance(app: Express) {
  app.use('/', routes);
}