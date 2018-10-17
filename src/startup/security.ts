import { Express, RequestHandler, Request, Response } from 'express';
import session from 'express-session';
import config from 'config';

import { serializeUser, deserializeUser } from 'passport';
import { session as psession, initialize } from 'passport';
import { db } from '../database';
import { NextFunction } from 'connect';

import helmet from 'helmet';
import { singleRequestCache } from '../database/utils/RequestCache';
import { User } from '../classes/User';

/**
 * Make sure all the passport required imports are added
 *
 * @export
 * @param {Express} app
 */
export function setupSecurity(app: Express) {
  // Make sure all routes go through the authentication
  app.all('*', (req, res, next) => {
    singleRequestCache.start();
    next();
  })

  app.use(helmet());

  app.use(session({
    secret: (<any>config.get('security')).secret || '',
    name: 'cms.session',
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'localhost',
    },
    resave: true,
    saveUninitialized: true
  }));

  app.use(initialize());
  app.use(psession());
  app.all('*', isAuthenticated);
}


/**
 * Check if a user is logged in. There are some publicly available paths so allow a user to hit those even if they are not logged in
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns
 */
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  let publicPaths = (config.get("security") as any).publicPaths;

  // If the user is logged in or the path is public
  if(req.user || publicPaths.indexOf(req.path) != -1) {
    return next();
  }

  // Return an unauthorized message to the user
  return res.sendStatus(401);
  //return res.send("Please login");
}

// Passport serialize
serializeUser(function(user: any, done) {
  done(null, user.id);
});

// Passport deserialize
deserializeUser(function(id: string|number, done) {
  db.getSequelize().models.users
    .findById(id)
    .then(val => {
      singleRequestCache.set("user", new User(val.dataValues));
      var a = singleRequestCache.get("user");
      done(null, val);
    })
    .catch(err => {
      singleRequestCache.flush();
      done(err);
    });
});
