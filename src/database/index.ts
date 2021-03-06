import sequelize, { Sequelize } from 'sequelize';
import config from 'config';
import { error, info } from 'winston';

import { createBaseModels, setupDefaultDatabaseValues } from './models';
import { BaseTableModel } from './models/BaseModel';
import { IBaseTable } from '../classes/Base';
import { IAccessModel, AccessTypes } from './models/access';
import { singleRequestCache } from './utils/RequestCache';
import { promises } from 'fs';

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
    var conf: any = config.get('dbConfig');

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
        $OR: sequelize.Op.or
      }
    });

    this.addHooks(sq);
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
    sq.addHook('beforeDefine', (attr: sequelize.DefineAttributes, opt: sequelize.DefineOptions<any>) => {
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
      attr.editable = {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      };
    });

    /*
    FIND
    */
    sq.addHook('beforeFind', function(this: BaseTableModel<IBaseTable, {}>, instance: any) {
      info('in find');
      var b = singleRequestCache.get('user');
      if (!singleRequestCache.get('user') || this.name === 'access') {
        return Promise.resolve();
      }

      // Column and Table Security
      let prom = (<IAccessModel>sq.models.access).HasAccessToTable(AccessTypes.Read, 'users');

      return prom.then(val => {
        if (!val) {
          info('No Access to ');
          return Promise.resolve();
        }

        let p = Promise.resolve();
        // Add all the attributes to the instance so that security can be run
        if (!instance.attributes) {
          //this.getSequelize().models[]
          p = p.then(() => this.describe()).then(v => {
            instance.attributes = Object.keys(v);
            return;
          });
        }
        // Check if users can read columns, and remove any that are not available
        return p
          .then(() => {
            return Promise.all(
              (<Array<string>>Object.values(instance.attributes)).map((v) => {
                return (<IAccessModel>sq.models.access).HasAccessToColumn(AccessTypes.Read, 'users', v).then(res => {
                  return res ? v : null;
                });
              })
            );
          })
          .then(res => {
            return res.reduce((prev, curr, index) => {
              if (curr != null) {
                prev[index] = curr;
              }
              return prev;
            }, new Array(res.length));
          })
          .then(res => {
            instance.attributes = res;
            return;
          })
          .catch(err => {
            error(err);
            throw new Error(err);
          });
      });
    });
    sq.addHook('afterFind', (instance: any) => {
      info('in find');

      // Column and Table Security
    });

    /*
    VALIDATE
    */
    sq.addHook('beforeValidate', (instance: any) => {
      info('in find');
      instance.createdBy = instance.createdBy || 'system';
      instance.updatedBy = instance.updatedBy || 'system';

      // Column and Table Security
    });
    sq.addHook('afterValidate', (instance: any) => {
      info('in find');

      // Column and Table Security
    });

    /*
    CREATE
    */
    sq.addHook('beforeCreate', (instance: any, options: any) => {
      info('in create');
      // Column and Table Security
    });
    sq.addHook('afterCreate', (instance: any, options: any) => {
      info('in create');

      // Column and Table Security
    });

    /*
    UPDATE
    */
    sq.addHook('beforeUpdate', (instance: any, options: any) => {
      info('in update');

      // Column and Table Security
    });
    sq.addHook('afterUpdate', (instance: any, options: any) => {
      info('in update');

      // Column and Table Security
    });

    /*
    DESTROY
    */
    sq.addHook('beforeDestroy', (instance: any, options: any) => {
      info('in destroy');

      // Column and Table Security
    });
    sq.addHook('afterDestroy', (instance: any, options: any) => {
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

    // Make sure all the base tables are created
    createBaseModels(s);

    // Update the database with these models
    let match = (config.get('dbConfig') as any).refreshDatabaseMatch || '_DEV$';
    s.sync({
      // Allow the database to be completely cleared if true
      force: (config.get('dbConfig') as any).refreshDatabase || false,

      // Check to make sure that the database name matches the ones allowed to be cleared
      match: new RegExp(match)
    })
      .then(() => {
        info('Created Default Schema in Database.');
        return setupDefaultDatabaseValues(s);
      })
      .then(() => {
        info('Setup default values in the database (Access rules and table definitions)');
        return true;
      })
      .catch(err => {
        error('Failed to create default schema in database.');
        error(err);
      });
  }
}

export let db = new DBConnection();
