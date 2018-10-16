import {Sequelize, DataTypes} from 'sequelize';
import { BaseTableModel, BaseTable } from './BaseModel';
import { db } from '..';
import { MapToFieldType } from './DataTypes';
import { IFieldTypeModel } from './field_types';
import { error } from 'winston';


export interface IColumn extends BaseTable {
  name: string;
  label: string;
}

export interface IColumnModel extends BaseTableModel<IColumn, {}> {
  CreateColumnsForTable(table: string): Promise<boolean>;
}

/**
 * Column definition
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function ColumnDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  let model = sequelize.define("columns", {
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
    defaultValue: DataTypes.TEXT
  }) as IColumnModel;

  model.CreateColumnsForTable = function(tableName) {
    let sq = db.getSequelize();
    return Promise.resolve()
    .then(v => (<IFieldTypeModel>sq.models.field_types).count())
    .then(c => {
      // This is used to ensure the field types table is populated before populating the columns. Note this happends on startup.
      if(c > 0) {
        return (<BaseTableModel<BaseTable, {}>>sq.models[tableName]).describe();
      }
      return {};
    })
    .then((table: any) => {
      return Promise.all(Object.keys(table).map(column => {
        return sq.models.columns.findOrCreate({
          where: {
            tableName: tableName,
            columnName: column,
          },
          defaults: {
            columnLabel: column.replace( /([A-Z])/g, " $1"),
            fieldTypeId: MapToFieldType((<any>table)[column].type)
          }
        })
      }))
    })
    .then(() => true)
    .catch((err) => {
      error(err);
      throw new Error(err);
    });
  }

  return model;
}
