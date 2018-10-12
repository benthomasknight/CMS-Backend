import {Sequelize, DataTypes, Model} from 'sequelize';
import { IUser } from './users';

export interface IAccessModel extends Model<{}, {}> {
  HasAccessToTable(table: string, user: IUser): Promise<boolean>;
  HasAccessToColumn(table: string, column: string, user: IUser): Promise<boolean>;
}

/**
 * Access is the ACL manager for tables and columns
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function AccessDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  let model =  sequelize.define("access", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ['C', 'R', 'U', 'D']
    },
    tableName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    columnName: {
      type: DataTypes.STRING,
    },
    defaultValue: DataTypes.TEXT,
  }) as IAccessModel;

  model.HasAccessToTable = async (table: string, user: IUser) => {
    return true;
  }

  model.HasAccessToColumn = async (table: string, column:string, user: IUser) => {
    return true;
  }

  return model;
}
