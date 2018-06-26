import { Express } from 'express';
import { routes } from './routes';

import {use} from 'passport';
import {Strategy as LocalStrategy} from 'passport-local'
import { authenticate } from './database/security/authenticate';

/**
 * Instance is the entry way for all instances of the program.
 *
 * @export
 * @param {Express} app
 */
export function Instance(app: Express) {
  app.use('/', routes);

  // User authentication
  use(new LocalStrategy(authenticate));
}