import sequelize = require("sequelize");

export interface BaseTableModel<TInstance, TAttributes> extends sequelize.Model<TInstance, TAttributes> {
  PostCreateScript?(): Promise<boolean>;
}
