import { Sequelize } from "sequelize";

import { TypesDefinition } from './field_types';
import { ColumnDefinition } from './column';
import { UsersDefinition } from './user';
import { TriggerDefinition } from "./trigger";
import { AccessDefinition } from "./access";
import { TableDefinition } from './tables';
import { FindOrCreateTable } from "../utils/TableSyncUtils";
import { BaseTableModel } from "./BaseModel";
import { RoleDefinition } from "./role";
import { UserRoleDefinition } from "./user_role";
import { IBaseTable } from "../../classes/Base";


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
  // Run each post script in sequence
  return Object.keys(s.models).reduce((prev, curr) => {
    // Create all tables
    return prev.then(() => {
      return FindOrCreateTable(curr)
      // Set any default values
      .then(() => {
        // Create all default values for the current tables
        let func = (<BaseTableModel<IBaseTable, {}>>s.models[curr]).PostCreateScript;
        if(func) {
          return func();
        }
        return false;
      })
    });
  }, Promise.resolve(true));
}
