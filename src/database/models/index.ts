import { Sequelize } from "sequelize";

import { TypesDefinition } from './field_types';
import { SchemaDefinition } from './schema';
import { UsersDefinition } from './users';

export function createBaseModels(s: Sequelize) {
   // Base records with no references
   let types = s.import('field_types', TypesDefinition);
   let users = s.import('users', UsersDefinition);

   // Tables with References
   let schema = s.import('schemas', SchemaDefinition);
   types.hasMany(schema);
}