import {Sequelize, DataTypes} from 'sequelize';

export function SchemaDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  return sequelize.define("schemas", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      values: [
        'beforeValidate',
        'afterValidate',
        'beforeCreate',
        'afterCreate',
        'beforeDestroy',
        'afterDestroy',
        'beforeUpdate',
        'afterUpdate',
        'beforeFind',
        'afterFind'
      ]
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    table: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: DataTypes.NUMBER,
    description: DataTypes.TEXT,
    script: DataTypes.TEXT
  })
}