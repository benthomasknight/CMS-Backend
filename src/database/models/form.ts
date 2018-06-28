import {Sequelize, DataTypes} from 'sequelize';

/**
 * Forms are the display available to the user
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function FormsDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  return sequelize.define("forms", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  })
}