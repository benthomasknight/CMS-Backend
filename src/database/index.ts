import sequelize from 'sequelize';
import config from 'config';
import {error, info} from 'winston';
import { TypesDefinition } from './types';
import { SchemaDefinition } from './schema';

class DBConnection {
  public sequelize: sequelize.Sequelize;

  constructor() {
    this.sequelize = this.getSequelize();
    this.buildDefaultDatabaseSchema();
  }

  public getSequelize(): sequelize.Sequelize {
    if (this.sequelize != null) {
      return this.sequelize;
    } else {
      return this.initSequelize();
    }
  }

  initSequelize(): sequelize.Sequelize {
    var conf:any = config.get('dbConfig');
    var database = `${conf.host}:${conf.port}`;
    let username = conf.username;
    let password = conf.password;

    return new sequelize({
      dialect: 'mssql',
      pool: {
        max: 10,
        min: 0,
        idle: 10000
      },
      host: conf.host,
      port: conf.port,
      username: conf.username,
      password: conf.password,
      database: conf.databasename
    });
  }

  test() {
    return this.getSequelize()
    .authenticate()
    .then(() => {
      info('Connection has been established successfully.');
      return true;
    })
    .catch(err => {
      error('Unable to connect to the database:');
      error(err);
      return false;
    });
  }

  buildDefaultDatabaseSchema() {
    var s = this.getSequelize();

    // Base records with no references
    let types = s.import('types', TypesDefinition);

    // Tables with References
    let schema = s.import('schema', SchemaDefinition);
    types.hasMany(schema);

    // Update the database with these models
    let refresh = (config.get('dbConfig') as any).refreshDatabase || false;
    let match = (config.get('dbConfig') as any).refreshDatabaseMatch || '_DEV$';
    s.sync({
      force: (config.get('dbConfig') as any).refreshDatabase || false,
      match: new RegExp(match)
    }).then(() => {
      info('Created Default Schema in Database.');
    }).catch((err) => {
      error('Failed to create default schema in database.');
      error(err);
    });
  }
}

export let db = new DBConnection();