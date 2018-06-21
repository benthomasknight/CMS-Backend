import { passwordValidation } from '../security/validation';
import {Sequelize, DataTypes} from 'sequelize';
import {hash} from '../security/encrypt';

interface IUser {
  username: string,
  password: string,
  first_name: string,
  last_name: string
}

export function UsersDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  return sequelize.define("users", {
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
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCreate: (user: IUser, options) => {
        return hash(user.password).then(val => {
          user.password = val;
        })
      }
    }
  })
}