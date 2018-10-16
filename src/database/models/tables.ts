import {Sequelize, DataTypes} from 'sequelize';
import { BaseTable, BaseTableModel } from './BaseModel';
import sequelize = require('sequelize');
import { FindOrCreateDefaultAccess } from '../utils/TableSyncUtils';
import { IColumnModel } from './column';
import { db } from '..';
import { error } from 'winston';

export interface ITable extends BaseTable {
  name: string;
  label: string;
}

export interface ITableModel extends BaseTableModel<ITable, {}> {

}

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
      primaryKey: true,
      unique: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },{
    hooks: {
      /**
       * Ensure the table actually exists in the database before creating a
       * record in the tables table
       */
      beforeCreate: (table: ITable, options) => {
        if(!sequelize.isDefined(table.name)) {
          return sequelize.define(table.name, {}).sync();
        }
        return;
      },

      /**
       * Ensure that the new table has access rights
       */
      afterCreate: (table: ITable, options) => {
        let sq = db.getSequelize();
        return FindOrCreateDefaultAccess(table.name)
        .then(() => {
          if(sq.isDefined('field_types')) {
            return (<IColumnModel>sq.models.columns).CreateColumnsForTable(table.name)
          }
          return Promise.resolve(false);
        }).catch((err) => {
          error(err);
          throw new Error(err);
        });
      }
    }
  })
}
