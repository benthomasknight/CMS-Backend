import {Sequelize, DataTypes} from 'sequelize';
import { BaseTableModel } from './BaseModel';
import { db } from '..';
import { IBaseTable } from '../../classes/Base';

/**
 * Definition of the user table
 *
 * @export
 * @interface IUserRole
 * @extends {BaseTable}
 */
export interface IUserRole extends IBaseTable {
}

/**
 *Definition of the Access Model
 *
 * @export
 * @interface IUserRoleModel
 * @extends {sequelize.Model<IUserRole, {}>}
 */
export interface IUserRoleModel extends BaseTableModel<IUserRole, {}> {
}

/**
 * Access is the ACL manager for tables and columns
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function UserRoleDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  const model =  sequelize.define("user_roles", {}) as IUserRoleModel;

  return model;
}
