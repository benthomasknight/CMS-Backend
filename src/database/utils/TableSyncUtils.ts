import { db } from '../index';
import { AccessTypes, IAccessModel } from '../models/access';
import { ITableModel } from '../models/tables';

export function FindOrCreateTable(name: string) {
  let sq = db.getSequelize();
  return (<ITableModel>sq.models.tables).findOrCreate({
      where: {
        name: name
      },
      defaults: {
        label: name.split('_').map((v) => {
          return v.charAt(0).toUpperCase() + v.substring(1)
        }).join(' ')
      }
    })
}

export function FindOrCreateDefaultAccess(table: string) {
  let sq = db.getSequelize();
  return (<IAccessModel>sq.models.access).findOrCreate({
        where: {
          tableName: table,
          type: AccessTypes.Read
        },
        defaults: {
          type: AccessTypes.Read,
          tableName: table,
          columnName: null,
          script: 'return true'
        }
      })
}
