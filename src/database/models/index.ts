import { Sequelize } from "sequelize";

import { TypesDefinition } from './field_types';
import { SchemaDefinition } from './schema';
import { UsersDefinition } from './users';
import { TriggerDefinition } from "./trigger";
import { AccessDefinition } from "./access";

export function createBaseModels(s: Sequelize) {
   // Base records with no references
   let types = s.import('field_types', TypesDefinition);
   let schema = s.import('schemas', SchemaDefinition);
   let users = s.import('users', UsersDefinition);
   let trigger = s.import('trigggers', TriggerDefinition);
   let access = s.import('access', AccessDefinition);

   // Tables References
   types.hasMany(schema);
}