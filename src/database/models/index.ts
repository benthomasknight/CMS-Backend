import { Sequelize } from "sequelize";

import { TypesDefinition } from './field_types';
import { SchemaDefinition } from './schema';
import { UsersDefinition } from './users';
import { TriggerDefinition } from "./trigger";
import { AccessDefinition } from "./access";
import { TableDefinition } from './tables';

export function createBaseModels(s: Sequelize) {
   // Base records with no references
   let types = s.import('field_types', TypesDefinition);
   let tables = s.import('tables', TableDefinition);
   let schema = s.import('schemas', SchemaDefinition);
   let users = s.import('users', UsersDefinition);
   let trigger = s.import('triggers', TriggerDefinition);
   let access = s.import('access', AccessDefinition);

   // Tables References
   tables.hasMany(schema);
   types.hasMany(schema);
}
