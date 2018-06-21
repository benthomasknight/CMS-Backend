import {Sequelize, DataTypes} from 'sequelize';

export function SchemaDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  return sequelize.define("schema", {
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
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    defaultValue: DataTypes.TEXT
  })
}