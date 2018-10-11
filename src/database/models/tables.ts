import {Sequelize, DataTypes} from 'sequelize';

/**
 * Table definition
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function TableDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  return sequelize.define("tables", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  })
}
