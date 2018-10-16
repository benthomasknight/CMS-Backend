import {Sequelize, DataTypes} from 'sequelize';
import { IUser } from './user';
import { BaseTable, BaseTableModel } from './BaseModel';
import sequelize = require('sequelize');

export enum AccessTypes {
  Create = 'C',
  Read = 'R',
  Update = 'U',
  Delete = 'D'
}

/**
 * Definition of the user table
 *
 * @export
 * @interface IAccess
 * @extends {BaseTable}
 */
export interface IAccess extends BaseTable {
  type: AccessTypes,
  tableName: string,
  columnName: string,
  script: string,
}

/**
 *Definition of the Access Model
 *
 * @export
 * @interface IAccessModel
 * @extends {sequelize.Model<IAccess, {}>}
 */
export interface IAccessModel extends BaseTableModel<IAccess, {}> {
  HasAccessToTable(type:AccessTypes, table: string): Promise<boolean>;
  HasAccessToColumn(type:AccessTypes, table: string, column: string): Promise<boolean>;
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
  const model =  sequelize.define("access", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      values: Object.values(AccessTypes)
    },
    tableName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    columnName: {
      type: DataTypes.STRING,
    },
    script: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }) as IAccessModel;

  /**
   * Check if the current user has access rights to a given table
   */
  model.HasAccessToTable = async function(type:AccessTypes, table: string) {
    return this.findAll({
      where: {
        tableName: table,
        type:type
      }
    })
    .then(function(res: Array<IAccess>) {
      return res.some(function(value, _index, _arr) {
        return eval(value.script);
      });
    });
  }

  /**
   * Check if the current user has access rights to a given column
   */
  model.HasAccessToColumn = async function(type:AccessTypes, table: string, column:string) {
    return this.findAll({
      where: {
        tableName: table,
        type:type,
        columnName: column
      }
    })
    .then(function(res: Array<IAccess>) {
      return res.some(function(value, _index, _arr) {
        return eval(value.script);
      });
    });
  }

  return model;
}
