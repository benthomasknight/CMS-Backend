import {Sequelize, DataTypes} from 'sequelize';
import { BaseTableModel } from './BaseModel';
import { db } from '..';
import { error } from 'winston';
import { IBaseTable } from '../../classes/Base';

/**
 * Definition of the user table
 *
 * @export
 * @interface IRole
 * @extends {BaseTable}
 */
export interface IRole extends IBaseTable {
}

/**
 *Definition of the Access Model
 *
 * @export
 * @interface IRoleModel
 * @extends {sequelize.Model<IRole, {}>}
 */
export interface IRoleModel extends BaseTableModel<IRole, {}> {
}

/**
 * Access is the ACL manager for tables and columns
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function RoleDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  const model =  sequelize.define("roles", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
    },
  }) as IRoleModel;



  model.PostCreateScript = function() {
    let sq = db.getSequelize();
    return Promise.resolve((<IRoleModel>sq.models.roles).findOrCreate({
      where: {
        code: 'admin'
      },
      defaults: {
        label: 'Admin'
      }
    }))
    .then(() => true)
    .catch(err => {
      error(err);
      throw new Error(err);
    });
  }

  return model;
}
