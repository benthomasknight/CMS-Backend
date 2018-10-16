import sequelize = require("sequelize");

/**
 * Base Model, All tables have these columns
 *
 * @export
 * @interface BaseModel
 */
export interface BaseTable {
  updatedAt: Date;
  createdAt: Date;
  createdBy: Date;
  updatedBy: string;
  active: boolean;
}

export interface BaseTableModel<TInstance, TAttributes> extends sequelize.Model<TInstance, TAttributes> {
  PostCreateScript?(): Promise<boolean>;
}
