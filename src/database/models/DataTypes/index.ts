import { StringType } from './StringType'
export { StringType }
import { NumberType } from './NumberType'
export { NumberType }
import { DateType } from './DateType'
export { DateType }
import { BooleanType } from './BooleanType';
export { BooleanType }

export const types = [
  StringType.code,
  NumberType.code,
  DateType.code,
  BooleanType.code
]

export function MapToFieldType(type: string) {
  switch(type) {
    case 'BIGINT':
    case 'INT':
    case 'SMALLINT':
    case 'TINYINT':
    case 'NUMERIC':
    case 'DECIMAL':
    case 'SMALLMONEY':
    case 'MONEY':
    case 'FLOAT':
    case 'REAL':
      return 2;
    case 'BIT':
      return 4;
    case 'DATE':
    case 'DATETIMEOFFSET':
    case 'DATETIME2':
    case 'SMALLDATETIME':
    case 'DATETIME':
    case 'TIME':
      return 3;
    case 'CHAR':
    case 'VARCHAR':
    case 'TEXT':
    case 'NCHAR':
    case 'NVARCHAR':
    case 'NTEXT':
      return 1;
    case 'BINARY':
    case 'VARBINARY':
    case 'IMAGE':
      return 1;
    default:
      return 1;
  }
}
