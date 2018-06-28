import {Sequelize, DataTypes} from 'sequelize';

/**
 * Triggers that run at certain events. eg. beforeUpdate
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function TriggerDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  return sequelize.define("triggers", {
    type: {
      type: DataTypes.ENUM,
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
    order: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    script: DataTypes.TEXT
  })
}