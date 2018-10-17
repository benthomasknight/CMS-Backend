import { BaseTable, IBaseTable } from "./Base";

export interface IUser extends IBaseTable {
  username: string,
  password: string,
  first_name: string,
  last_name: string
}

export class User extends BaseTable implements IUser {
  public username: string;
  public password: string;
  public first_name: string;
  public last_name: string;

  constructor(userObject: IUser) {
    super(userObject);
    this.username = userObject.username;
    this.password = userObject.password;
    this.first_name = userObject.first_name;
    this.last_name = userObject.last_name;
  }
}
