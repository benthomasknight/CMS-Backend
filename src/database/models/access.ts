import {Sequelize, DataTypes} from 'sequelize';

/**
 * Access is the ACL manager for tables and columns
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function AccessDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  return sequelize.define("access", {
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
  })
}
/*
function HasAccessToTable(table) {

}

function HasAccessToColumn(table, column) {

}*/