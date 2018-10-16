export abstract class BaseType {
  value: any;
  toString() {
    return this.value.toString();
  }
  validate() {
    return true;
  }
}
