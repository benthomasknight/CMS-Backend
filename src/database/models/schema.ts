import {Sequelize, DataTypes} from 'sequelize';

export function SchemaDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  return sequelize.define("schemas", {
    tableName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    columnName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    columnLabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    defaultValue: DataTypes.TEXT,
  })
}