import {hash as bcryptHash} from 'bcrypt';
import {get} from 'config';

let rounds = (get('security') as any).rounds as number;
export function hash(value: string) {
  return bcryptHash(value, rounds);
}