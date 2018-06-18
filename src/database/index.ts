import Sequelize from 'sequelize';
import config from 'config';

class DBConnection {
  public sequelize: Sequelize.Sequelize;

  constructor() {
    this.sequelize = this.getSequelize();
  }

  public getSequelize(): Sequelize.Sequelize {
    if (this.sequelize != null) {
      return this.sequelize;
    } else {
      return this.initSequelize();
    }
  }

  initSequelize(): Sequelize.Sequelize {
    var conf:any = config.get('dbConfig');
    var database = `${conf.host}:${conf.port}`;
    let username = conf.username;
    let password = conf.password;

    return new Sequelize({
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
    this.getSequelize()
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  }
}

export let db = new DBConnection();