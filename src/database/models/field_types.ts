import {Sequelize, DataTypes} from 'sequelize';

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