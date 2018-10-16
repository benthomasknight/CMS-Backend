import { passwordValidation } from '../security/validation';
import {Sequelize, DataTypes} from 'sequelize';
import {hash} from '../security/encrypt';
import sequelize = require('sequelize');
import { BaseTableModel, BaseTable } from './BaseModel';

export interface IUser extends BaseTable {
  username: string,
  password: string,
  first_name: string,
  last_name: string
}

export interface IUserModel extends BaseTableModel<IUser, {}> {
  /**
   * Check if a given user exists
   *
   * @param {string} username
   * @returns {Promise<boolean>} - True if the user already exists
   * @memberof IUserModel
   */
  UserExists(username:string): Promise<boolean>;


  /**
   * Creates a user from the given object
   *
   * @param {IUser} data
   * @returns {Promise<IUser>}
   * @memberof IUserModel
   */
  CreateUser(data: IUser): Promise<IUser>;
}
/**
 * User Definition schema
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function UsersDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  const model = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        passwordValidation
      }
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCreate: (user: IUser, options) => {
        return hash(user.password).then(val => {
          user.password = val;
        })
      },
      beforeUpdate: (user: IUser, options) => {
        return hash(user.password).then(val => {
          user.password = val;
        })
      }
    }
  }) as IUserModel;

  /**
   * Check if a user currently exists
   */
  model.UserExists = async function(username) {
    return this.findOne({
      where: {
        username: username
      }
    }).then(user => {
      return user != null;
    });
  };

  model.CreateUser = async function(data) {
    return this.create(data, {
      isNewRecord: true,
      validate: true
    });
  };

  return model;
}

