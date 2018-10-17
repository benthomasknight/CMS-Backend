import {Sequelize, DataTypes} from 'sequelize';
import { BaseTableModel } from './BaseModel';
import sequelize = require('sequelize');
import { types, MapToFieldType } from './DataTypes';
import { error } from 'winston';
import { db } from '..';
import { IColumnModel } from './column';
import { IBaseTable } from '../../classes/Base';

export interface IFieldType extends IBaseTable {
  id: number;
  label: string;
}

export interface IFieldTypeModel extends BaseTableModel<IFieldType, {}> {
  PostCreateScript(): Promise<boolean>;
}

/**
 * Data Types available to use as columns in a table
 *
 * @export
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
export function TypesDefinition(sequelize:Sequelize, DataTypes:DataTypes) {
  let model = sequelize.define("field_types", {
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
  }) as IFieldTypeModel;

  model.PostCreateScript = function() {
    let sq = db.getSequelize();
    return Promise.all(types.map(v => {
      return sq.models.field_types.findOrCreate({
        where: {
          label: v
        }
      })
    })).then(() => {
      // Field types exist so now the existing columns can be specified
      return Promise.all(Object.keys(sq.models).map((v) => {
        return (<IColumnModel>sq.models.columns).CreateColumnsForTable(v);
      }))
    })
    .then(() => true)
    .catch(err => {
      error(err);
      throw new Error(err);
    });
  }

  return model;
}
