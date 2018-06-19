import {db} from '../database';

export function validate() {
  // Run all database validations for startup, returning a single true/false value
  return Promise.all([db.test()])
    .then(res => {
      // Only return a single true/false for if all validations pass or not
      return res.every(v => v);
    });
}