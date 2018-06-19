import {validate} from './db';

export function startup() {
  return Promise.all([validate()])
  .then(res => {
    // Only return a single true/false for if all startup activities
    return res.every(v => v);
  });;
}