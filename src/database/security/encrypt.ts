import {hash as bcryptHash, compare} from 'bcrypt';
import {get} from 'config';

let rounds = (get('security') as any).rounds as number;


/**
 * Has the provided string using BCRYPT
 *
 * @export
 * @param {string} value
 * @returns
 */
export function hash(value: string) {
  return bcryptHash(value, rounds);
}

export function comparePassword(value: string, hash: string) {
  return compare(value, hash);
}