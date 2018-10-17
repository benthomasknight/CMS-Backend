import NodeCache from 'node-cache';

/**
 * In-memory cache for each request. This should be used for things such as
 * - Access Control Caching
 * - Current User
 *
 * @class SingleRequestCache
 */
class SingleRequestCache {
  private static _instance: SingleRequestCache;
  private cache:NodeCache;

  private constructor() {
    this.cache = new NodeCache();
  }

  static Instance() {
    return this._instance || (this._instance = new this());
  }

  start() {
    this.cache = new NodeCache();
  }

  flush() {
    this.cache.flushAll();
  }

  set(key: string, val: any, ttl?:number) {
    var success = this.cache.set(key, val);

    if(success && ttl) {
      this.setTTL(key, ttl);
    }
    return success;
  }

  get(key: string) {
    return this.cache.get(key) as unknown;
  }

  getAll(keys: Array<string>) {
    return this.cache.mget(keys) as {[key:string]: unknown};
  }

  delete(key: string) {
    return this.cache.del(key);
  }

  deleteAll(keys: Array<string>) {
    keys.forEach((v) => {
      this.delete(v);
    })
  }

  setTTL(key:string, ttl:number) {
    return this.cache.ttl(key, ttl);
  }

  getTTL(key: string) {
    return this.cache.getTtl(key);
  }

  keys() {
    return this.cache.keys();
  }
}


export let singleRequestCache = SingleRequestCache.Instance();
