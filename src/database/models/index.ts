import { Sequelize } from "sequelize";

import { TypesDefinition } from './field_types';
import { ColumnDefinition } from './column';
import { UsersDefinition } from './user';
import { TriggerDefinition } from "./trigger";
import { AccessDefinition } from "./access";
import { TableDefinition } from './tables';
import { FindOrCreateTable } from "../utils/TableSyncUtils";
import { BaseTableModel, BaseTable } from "./BaseModel";
import { RoleDefinition } from "./role";
import { UserRoleDefinition } from "./user_role";


/**
 * Creates the default tables and keys
 *
 * @export
 * @param {Sequelize} s
 */
export function createBaseModels(s: Sequelize) {
   // Base records with no references
   let tables = s.import('tables', TableDefinition);
   let types = s.import('field_types', TypesDefinition);
   let column = s.import('columns', ColumnDefinition);
   let users = s.import('users', UsersDefinition);
   let trigger = s.import('triggers', TriggerDefinition);
   let access = s.import('access', AccessDefinition);
   let role = s.import("roles", RoleDefinition);
   let userRole = s.import("user_roles", UserRoleDefinition);

   // Tables References
   tables.hasMany(column);
   types.hasMany(column);

   users.hasMany(userRole);
   role.hasMany(userRole);
}

/**
 * Populates the default entries
 *
 * @export
 * @param {Sequelize} s
 * @returns
 */
export async function setupDefaultDatabaseValues(s: Sequelize) {
  return Promise.all(Object.keys(s.models).map((v) => {
    // Create all tables
    return FindOrCreateTable(v)
    // Set any default values
    .then(() => {
      // Create all default values for the current tables
      let func = (<BaseTableModel<BaseTable, {}>>s.models[v]).PostCreateScript;
      if(func) {
        return func();
      }
      return false;
    })
  }));
}
