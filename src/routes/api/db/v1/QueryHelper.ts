import {Op} from 'sequelize';

interface IAcceptedParameters {
  id?: string,
  query?: {
    [key:string]: any;
  };
  columns?: Array<string>
}

export class QueryHelper {
  static getQueryParameters(q: any) {
    let res: IAcceptedParameters = {};

    if(q.id) {
      res.id = q.id
    }
    if(q.query) {
      res.query = JSON.parse(q.query);
    }
    if(q.columns) {
      res.columns = q.columns.split(',');
    }

    return res;
  }
}