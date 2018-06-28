import {Sequelize, DataTypes} from 'sequelize';

/**
 * Data Types available to use as columns in a table
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function TypesDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  return sequelize.define("field_types", {
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