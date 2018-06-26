import { db } from "..";
import { hash, comparePassword } from "./encrypt";

/**
 * Run passport local authentication
 *
 * @export
 * @param {string} username
 * @param {string} password
 * @param {Function} done
 */
export function authenticate(username:string, password:string, done:Function) {
  let sq = db.getSequelize();

  // Look for the user with the given username and password
  sq.models.users.findOne({
    where: {
      username: username
    }
  })
  .then((user) => {
    // No error, but the user isn't found
    if(user == null) {
      return user;
    }

    return comparePassword(password, user.password).then(same => {
      if(same) {
        return user;
      }
      return null;
    });
  }).then((user) => {
    // No error, but the users password was wrong
    if(user == null) {
      return done(null, false, "Invalid Username or Password");
    }

    // User found
    return done(null, user);
  })
  .catch(err => {
    // Unknown error occured
    return done(err);
  });
}

