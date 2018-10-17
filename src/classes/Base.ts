/**
 * Base Model, All tables have these columns
 *
 * @export
 * @interface BaseModel
 */
export interface IBaseTable {
  updatedAt: Date;
  createdAt: Date;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

export abstract class BaseTable implements IBaseTable {
  public updatedAt: Date;
  public updatedBy: string;

  public createdAt: Date;
  public createdBy: string;

  public active: boolean;
  constructor(userObject: IBaseTable) {
    this.updatedAt = userObject.updatedAt;
    this.createdAt = userObject.createdAt;
    this.createdBy = userObject.createdBy;
    this.updatedBy = userObject.updatedBy;
    this.active = userObject.active;
  }
}
