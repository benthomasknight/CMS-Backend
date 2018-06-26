import sequelize, { Sequelize } from 'sequelize';
import config from 'config';
import {error, info} from 'winston';
import { TypesDefinition } from './models/field_types';
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

    let sq = new sequelize({
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
      database: conf.databasename,
      operatorsAliases: {
        $EQ: sequelize.Op.eq,
        $NEQ: sequelize.Op.ne,
        $GTE: sequelize.Op.gte,
        $GT: sequelize.Op.gt,
        $LTE: sequelize.Op.lte,
        $LT: sequelize.Op.lt,
        $NOT: sequelize.Op.not,
        $IN: sequelize.Op.in,
        $NIN: sequelize.Op.notIn,
        $LIKE: sequelize.Op.like,
        $NLIKE: sequelize.Op.notLike,
        $BETWEEN: sequelize.Op.between,
        $NBETWEEN: sequelize.Op.notBetween,

        $AND: sequelize.Op.and,
        $OR: sequelize.Op.or,
      }
    });

    return sq;
  }

  /**
   * Add all hooks
   *
   * @private
   * @memberof DBConnection
   */
  private addHooks(sq: Sequelize) {

    /*
    MODEL DEFINE
    */
    sq.addHook('beforeDefine',(attr: sequelize.DefineAttributes, opt: sequelize.DefineOptions<any>) => {
      // Default Columns
      attr.createdBy = {
        type: sequelize.STRING,
        allowNull: false
      };
      attr.updatedBy = {
        type: sequelize.STRING,
        allowNull: false
      };
      attr.active = {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      };
    })


    /*
    FIND
    */
    sq.addHook('beforeFind', (instance:any) => {
      info('in find');

      // Column and Table Security
    });

    /*
    VALIDATE
    */
    sq.addHook('beforeValidate', (instance:any) => {
      info('in find');

      // Column and Table Security
    });

    /*
    CREATE
    */
    sq.addHook('beforeCreate', (instance:any, options:any) => {
      info('in create');

      // Column and Table Security
    });

    /*
    UPDATE
    */
    sq.addHook('beforeUpdate', (instance:any, options:any) => {
      info('in update');

      // Column and Table Security
    });

    /*
    DESTROY
    */
    sq.addHook('beforeDestroy', (instance:any, options:any) => {
      info('in destroy');

      // Column and Table Security
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
    let types = s.import('field_types', TypesDefinition);
    let users = s.import('users', UsersDefinition);

    // Tables with References
    let schema = s.import('schemas', SchemaDefinition);
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
    }).catch((err) => {
      error('Failed to create default schema in database.');
      error(err);
    });
  }
}

export let db = new DBConnection();