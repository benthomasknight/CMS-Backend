import { db } from "..";
import { hash } from "./encrypt";

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

  // Hash the password before searching for it in the db
  hash(password).then(pass => {
    // Look for the user with the given username and password
    return sq.models.users.findOne({
      where: {
        username: username,
        password: pass
      }
    })
  }).then((user) => {
    // No error, but the user isn't found
    if(user == null) {
      return done(null, false, "Invalid username or password.");
    }

    // User found
    return done(null, user);
  })
  .catch(err => {
    // Unknown error occured
    return done(err);
  });
}

