import {Sequelize, DataTypes} from 'sequelize';
import { BaseTableModel } from './BaseModel';
import { singleRequestCache } from '../utils/RequestCache';
import { silly, error } from 'winston';
import { IBaseTable } from '../../classes/Base';
/*
Constants
*/
const UNIQUEKEY = 'IACCESS-';

/*
Model Definition
*/
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
export interface IAccess extends IBaseTable {
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
  getUniqueCacheKey(keys: Array<string>): string;
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
    var cachedResult = <boolean|undefined>singleRequestCache.get(this.getUniqueCacheKey([type, table]));

    if(cachedResult !== undefined) {
      return Promise.resolve(cachedResult);
    }

    return this.findAll({
      where: {
        tableName: table,
        type:type
      }
    })
    .then(function(res: Array<IAccess>) {
      return res.some(function(value, _index, _arr) {
        return new Function(value.script)();
      });
    })
    .then((val) => {
      singleRequestCache.set(this.getUniqueCacheKey([type, table]), val);
      return val;
    })
    .catch((err) => {
      error(err);
      throw new Error(err);
    });
  }

  /**
   * Check if the current user has access rights to a given column
   */
  model.HasAccessToColumn = async function(type:AccessTypes, table: string, column:string) {
    return this.HasAccessToTable(type, table)
    .then(val => {
      if(!val) {
        return false;
      }

      var cachedResult = <boolean|undefined>singleRequestCache.get(this.getUniqueCacheKey([type, table, column]));

      if(cachedResult !== undefined) {
        return Promise.resolve(cachedResult);
      }

      return this.findAll({
        where: {
          tableName: table,
          type:type,
          columnName: column
        }
      })
      .then(function(res: Array<IAccess>) {
        return res.length == 0 || res.some(function(value, _index, _arr) {
          return eval(value.script);
        });
      })
    })
    .then((val) => {
      singleRequestCache.set(this.getUniqueCacheKey([type, table, column]), val);
      return val;
    })
    .catch((err) => {
      error(err);
      throw new Error(err);
    });
  }

  model.getUniqueCacheKey = function(keys) {
    silly('Access Unique Key: ' + UNIQUEKEY + keys.join('-'));
    return UNIQUEKEY + keys.join('-');
  }

  return model;
}
