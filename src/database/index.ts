import sequelize from 'sequelize';
import config from 'config';
import {error, info} from 'winston';
import { TypesDefinition } from './models/types';
import { SchemaDefinition } from './models/schema';
import { UsersDefinition } from './models/users';

/**
 * Connection to the database
 *
 * @class DBConnection
 */
class DBConnection {
  public sequelize: sequelize.Sequelize;

  constructor() {
    this.sequelize = this.getSequelize();
    this.buildDefaultDatabaseSchema();
  }

  /**
   * Return a valid instance of the sequelize object.
   *
   * @returns {sequelize.Sequelize}
   * @memberof DBConnection
   */
  public getSequelize(): sequelize.Sequelize {
    if (this.sequelize != null) {
      return this.sequelize;
    } else {
      return this.initSequelize();
    }
  }

  /**
   * Create a valid instance of the sequelize object
   *
   * @returns {sequelize.Sequelize}
   * @memberof DBConnection
   */
  private initSequelize(): sequelize.Sequelize {
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

  /**
   * Test the connection to the database
   *
   * @returns
   * @memberof DBConnection
   */
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

  /**
   * Build up the default table schema. This includes the following:
   *
   * - Users
   * - Schema
   * - Types
   * - Security
   *
   * @memberof DBConnection
   */
  buildDefaultDatabaseSchema() {
    var s = this.getSequelize();

    // Base records with no references
    let types = s.import('types', TypesDefinition);
    let users = s.import('users', UsersDefinition);

    // Tables with References
    let schema = s.import('schema', SchemaDefinition);
    types.hasMany(schema);

    // Update the database with these models
    let refresh = (config.get('dbConfig') as any).refreshDatabase || false;
    let match = (config.get('dbConfig') as any).refreshDatabaseMatch || '_DEV$';
    s.sync({
      // Allow the database to be completely cleared if true
      force: (config.get('dbConfig') as any).refreshDatabase || false,

      // Check to make sure that the database name matches the ones allowed to be cleared
      match: new RegExp(match)
    }).then(() => {
      info('Created Default Schema in Database.');

      // Test generation of a user
      /*users.findOrCreate({where: {username: 'rxp.bk'}, defaults: {password: 'Password'}}).spread((val, cre) => {
        info(cre);
        info(val);
      })
      .catch((err) => {
        error(err);
      });*/

    }).catch((err) => {
      error('Failed to create default schema in database.');
      error(err);
    });
  }
}

export let db = new DBConnection();