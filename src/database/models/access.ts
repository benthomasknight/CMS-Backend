import {Sequelize, DataTypes} from 'sequelize';

export function SchemaDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  return sequelize.define("schemas", {
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