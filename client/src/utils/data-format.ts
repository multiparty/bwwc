import { Positions } from './positions';
import { Ethnicity } from './ethnicity';
import { Gender } from './gender';

export type TableData = {
  [key in Positions]: {
    [key in Ethnicity]: {
      [key in Gender]: number;
    };
  };
};

export interface DataFormat {
  numberOfEmployees: TableData;
  wages: TableData;
  performance: TableData;
  lengthOfService: TableData;
}
